import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Palmtree, FileText, FolderOpen, ShieldCheck, LogOut, ArrowLeft, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import logo from '@/assets/logo-fornroca.png';
import { birthCode, normalizeDni, PORTAL_DOCUMENTS } from '@/portal/documents';
import { DocumentsView } from '@/components/portal/DocumentsView';
import { ContractView } from '@/components/portal/ContractView';
import { AdminPanel } from '@/components/portal/AdminPanel';
import type { Tables } from '@/integrations/supabase/types';

export const VACATIONS_URL = 'https://calendariofornroca.lovable.app';

type Worker = Tables<'workers'>;
type View = 'menu' | 'contract' | 'documents' | 'admin';

function LoginForm({ onDone }: { onDone: () => void }) {
  const [dni, setDni] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!dni || !day || !month || !year) return setError('Rellena el DNI y los tres recuadros de la fecha.');
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('portal-login', {
      body: { dni: normalizeDni(dni), birth: birthCode(day, month, year) },
    });
    if (error || !data?.ok) {
      setBusy(false);
      return setError(data?.error ?? 'No se pudo entrar. Inténtalo otra vez.');
    }
    await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token });
    setBusy(false);
    onDone();
  };

  const box = 'h-16 text-center text-2xl tracking-widest';
  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md space-y-8 rounded-md border border-border bg-card p-8 shadow-sm">
      <div className="text-center space-y-2">
        <p className="text-caption text-material">Àrea de treballadors</p>
        <h1 className="heading-section text-foreground">Entra en tu espacio</h1>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dni" className="text-lg">1. Tu DNI</Label>
        <Input id="dni" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="12345678A"
          autoComplete="off" className="h-16 text-2xl uppercase tracking-widest" />
        <p className="text-sm text-muted-foreground">Números y letra, sin espacios.</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-lg font-medium">2. Tu fecha de nacimiento</legend>
        <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-3">
          <div><Input aria-label="Día" inputMode="numeric" maxLength={2} placeholder="DD" value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))} className={box} /><p className="mt-1 text-center text-sm text-muted-foreground">Día</p></div>
          <div><Input aria-label="Mes" inputMode="numeric" maxLength={2} placeholder="MM" value={month} onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))} className={box} /><p className="mt-1 text-center text-sm text-muted-foreground">Mes</p></div>
          <div><Input aria-label="Año" inputMode="numeric" maxLength={4} placeholder="AAAA" value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))} className={box} /><p className="mt-1 text-center text-sm text-muted-foreground">Año</p></div>
        </div>
      </fieldset>

      {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-center text-destructive">{error}</p>}

      <Button type="submit" disabled={busy} className="h-16 w-full text-xl">
        {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : '3. Entrar'}
      </Button>
    </form>
  );
}

function BigTile({ icon: Icon, label, onClick, href, warn, ok }: {
  icon: typeof Palmtree; label: string; onClick?: () => void; href?: string; warn?: boolean; ok?: boolean;
}) {
  const cls = 'relative flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-border bg-card p-6 text-foreground shadow-sm transition hover:border-gold hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring';
  const inner = (
    <>
      {warn && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-gold-foreground"><AlertTriangle className="h-4 w-4" /> Falta firmar</span>}
      {ok && <span className="absolute right-3 top-3 text-material"><CheckCircle2 className="h-7 w-7" /></span>}
      <Icon className="h-20 w-20 text-material" strokeWidth={1.25} />
      <span className="heading-section text-center">{label}</span>
    </>
  );
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
    : <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

export default function Treballadors() {
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pending, setPending] = useState(0);
  const [view, setView] = useState<View>('menu');

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setWorker(null); setLoading(false); return; }
    const [{ data: w }, { data: roles }] = await Promise.all([
      supabase.from('workers').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', user.id),
    ]);
    setWorker(w ?? null);
    setIsAdmin(!!roles?.some((r) => r.role === 'admin'));
    if (w) {
      const { data: sigs } = await supabase.from('signatures').select('doc_key').eq('worker_id', w.id);
      const signed = new Set(sigs?.map((s) => s.doc_key));
      setPending(PORTAL_DOCUMENTS.filter((d) => !signed.has(d.key)).length);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.title = 'Àrea de treballadors · Forn Roca';
    load();
  }, [load]);

  const logout = async () => {
    await supabase.auth.signOut();
    setWorker(null); setView('menu');
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="container-editorial flex h-20 items-center justify-between">
          <a href="/"><img src={logo} alt="Forn Roca" className="h-10 w-auto" /></a>
          {worker && (
            <Button variant="outline" onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Salir</Button>
          )}
        </div>
      </header>

      <main className="container-editorial py-12">
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-10 w-10 animate-spin text-material" /></div>
        ) : !worker ? (
          <LoginForm onDone={() => { setLoading(true); load(); }} />
        ) : view === 'menu' ? (
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="text-center">
              <p className="text-caption text-material">Hola</p>
              <h1 className="heading-editorial text-foreground">{worker.full_name}</h1>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <BigTile icon={Palmtree} label="Vacaciones" href={VACATIONS_URL} />
              <BigTile icon={FileText} label="Tu Contrato" onClick={() => setView('contract')} />
              <BigTile icon={FolderOpen} label="Tus Documentos" onClick={() => setView('documents')} warn={pending > 0} ok={pending === 0} />
              {isAdmin && <BigTile icon={ShieldCheck} label="Gestión (Master)" onClick={() => setView('admin')} />}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">
            <Button variant="outline" size="lg" onClick={() => { setView('menu'); load(); }}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Volver al menú
            </Button>
            {view === 'contract' && <ContractView worker={worker} />}
            {view === 'documents' && <DocumentsView worker={worker} onChange={load} />}
            {view === 'admin' && isAdmin && <AdminPanel />}
          </div>
        )}
      </main>
    </div>
  );
}
