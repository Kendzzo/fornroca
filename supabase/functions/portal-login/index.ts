import { createClient } from 'npm:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const MAX_FAILS = 5
const WINDOW_MIN = 15

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { dni: rawDni, birth: rawBirth } = await req.json()
    const dni = String(rawDni ?? '').toUpperCase().replace(/[\s.-]/g, '')
    const birth = String(rawBirth ?? '').replace(/\D/g, '')
    if (!/^[A-Z0-9]{5,12}$/.test(dni) || !/^\d{6}$/.test(birth)) {
      return json({ ok: false, error: 'Revisa el DNI y la fecha.' })
    }

    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString()
    const { count } = await admin.from('login_attempts').select('id', { count: 'exact', head: true })
      .eq('dni', dni).eq('success', false).gte('created_at', since)
    if ((count ?? 0) >= MAX_FAILS) {
      return json({ ok: false, error: `Demasiados intentos. Espera ${WINDOW_MIN} minutos.` })
    }

    const { data: worker } = await admin.from('workers').select('*').eq('dni', dni).maybeSingle()
    if (!worker || !worker.active || worker.birth_code !== birth) {
      await admin.from('login_attempts').insert({ dni, success: false })
      return json({ ok: false, error: 'DNI o fecha incorrectos.' })
    }

    const email = `${dni.toLowerCase()}@treballadors.fornroca.com`
    const password = createHmac('sha256', serviceKey).update(`portal:${dni}`).digest('hex')

    let userId = worker.user_id as string | null
    if (!userId) {
      const { data: created, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
      if (error || !created.user) {
        console.error('createUser failed', error)
        return json({ ok: false, error: 'No se pudo crear el acceso.' }, 500)
      }
      userId = created.user.id
      await admin.from('workers').update({ user_id: userId }).eq('id', worker.id)
    }
    if (worker.is_master) {
      await admin.from('user_roles').upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' })
    }

    const anon = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } })
    const { data: signed, error: signErr } = await anon.auth.signInWithPassword({ email, password })
    if (signErr || !signed.session) {
      console.error('signIn failed', signErr)
      return json({ ok: false, error: 'No se pudo entrar. Inténtalo de nuevo.' }, 500)
    }
    await admin.from('login_attempts').insert({ dni, success: true })
    return json({
      ok: true,
      access_token: signed.session.access_token,
      refresh_token: signed.session.refresh_token,
    })
  } catch (e) {
    console.error(e)
    return json({ ok: false, error: 'Error del servidor.' }, 500)
  }
})
