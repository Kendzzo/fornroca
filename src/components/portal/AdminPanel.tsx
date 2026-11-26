import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Eye, FileUp, UserPlus, Loader2 } from 'lucide-react';
import { birthCode, normalizeDni, PORTAL_DOCUMENTS } from '@/portal/documents';
import type { Tables } from '@/integrations/supabase/types';

type Worker = Tables<'workers'>;
type Sig = Tables<'signatures'>;
type WFile = Tables<'worker_files'>;

async function openFile(path: string) {
  const { data } = await supabase.storage.from('worker-files').createSignedUrl(path, 600);
  if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener');
}

function AddWorker({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState(''); const [dni, setDni] = useState('');
  const [d, setD] = useState(''); const [m, setM] = useState(''); const [y, setY] = useState('');
  const [busy, setBusy] = useState(false);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dni || !d || !m || !y) return toast.error('Rellena todos los campos.');
    setBusy(true);
    const { error } = await supabase.from('workers').insert({ full_name: name.trim(), dni: normalizeDni(dni), birth_code: birthCode(d, m, y) });
    setBusy(false);
    if (error) return toast.error(error.code === '23505' ? 'Ese DNI ya existe.' : 'No se pudo dar de alta.');
    toast.success('Trabajador dado de alta');
    setName(''); setDni(''); setD(''); setM(''); setY('');
    onAdded();
  };
  return (
    <form onSubmit={add} className="grid gap-4 rounded-md border border-border bg-card p-6 md:grid-cols-[2fr_1.3fr_2fr_auto] md:items-end">
      <div className="space-y-1"><Label htmlFor="n">Nombre completo</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="space-y-1"><Label htmlFor="dn">DNI</Label><Input id="dn" value={dni} onChange={(e) => setDni(e.target.value)} className="uppercase" /></div>
      <div className="space-y-1"><Label>Nacimiento (DD / MM / AAAA)</Label>
        <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-2">
          <Input aria-label="Día" maxLength={2} value={d} onChange={(e) => setD(e.target.value.replace(/\D/g, ''))} />
          <Input aria-label="Mes" maxLength={2} value={m} onChange={(e) => setM(e.target.value.replace(/\D/g, ''))} />
          <Input aria-label="Año" maxLength={4} value={y} onChange={(e) => setY(e.target.value.replace(/\D/g, ''))} />
        </div></div>
      <Button type="submit" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="mr-2 h-4 w-4" /> Dar de alta</>}</Button>
    </form>
  );
}

function WorkerDetail({ worker, sigs, files, onChange }: { worker: Worker; sigs: Sig[]; files: WFile[]; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const uploadContract = async (file: File) => {
    setBusy(true);
    const path = `${worker.id}/contract/${Date.now()}.pdf`;
    const { error } = await supabase.storage.from('worker-files').upload(path, file, { contentType: 'application/pdf' });
    if (!error) await supabase.from('workers').update({ contract_path: path }).eq('id', worker.id);
    setBusy(false);
    if (error) return toast.error('No se pudo subir el contrato.');
    toast.success('Contrato subido'); onChange();
  };
  const toggle = async () => {
    const { error } = await supabase.from('workers').update({ active: !worker.active }).eq('id', worker.id);
    if (error) return toast.error('No se pudo cambiar el estado.');
    toast.success(worker.active ? 'Dado de baja' : 'Dado de alta'); onChange();
  };
  return (
    <div className="space-y-5 border-t border-border bg-secondary p-5">
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-input bg-background px-4 text-sm">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
          {worker.contract_path ? 'Sustituir contrato (PDF)' : 'Subir contrato (PDF)'}
          <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadContract(f); e.target.value = ''; }} />
        </label>
        {worker.contract_path && <Button variant="outline" onClick={() => openFile(worker.contract_path!)}><Eye className="mr-2 h-4 w-4" /> Ver contrato</Button>}
        {!worker.is_master && <Button variant={worker.active ? 'destructive' : 'default'} onClick={toggle}>{worker.active ? 'Dar de baja' : 'Reactivar'}</Button>}
      </div>
      <div>
        <p className="mb-2 font-medium">Firmas</p>
        <ul className="space-y-2">
          {PORTAL_DOCUMENTS.map((doc) => {
            const s = sigs.find((x) => x.doc_key === doc.key);
            return (
              <li key={doc.key} className="flex flex-wrap items-center gap-3 rounded-md bg-card p-3 text-sm">
                <span className="flex-1 font-medium">{doc.title}</span>
                {s ? <>
                  <span className="text-muted-foreground">{new Date(s.signed_at).toLocaleString('es-ES')}{s.choice && ` · ${doc.choices?.find((c) => c.value === s.choice)?.label}`}</span>
                  <Button size="sm" variant="ghost" onClick={() => openFile(s.signature_path)}><Eye className="mr-1 h-4 w-4" /> Firma</Button>
                </> : <Badge variant="outline" className="border-gold">Pendiente</Badge>}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="mb-2 font-medium">Carnet de manipulador</p>
        {files.length === 0 ? <p className="text-sm text-muted-foreground">No ha subido nada.</p> :
          files.map((f) => <Button key={f.id} size="sm" variant="ghost" onClick={() => openFile(f.path)}><Eye className="mr-1 h-4 w-4" /> {f.file_name}</Button>)}
      </div>
    </div>
  );
}

export function AdminPanel() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [sigs, setSigs] = useState<Sig[]>([]);
  const [files, setFiles] = useState<WFile[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    const [w, s, f] = await Promise.all([
      supabase.from('workers').select('*').order('full_name'),
      supabase.from('signatures').select('*').order('signed_at', { ascending: false }),
      supabase.from('worker_files').select('*').order('created_at', { ascending: false }),
    ]);
    setWorkers(w.data ?? []); setSigs(s.data ?? []); setFiles(f.data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = workers.filter((w) => (w.full_name + w.dni).toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="space-y-6">
      <h2 className="heading-editorial text-foreground">Gestión de trabajadores</h2>
      <AddWorker onAdded={load} />
      <Input placeholder="Buscar por nombre o DNI" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="overflow-hidden rounded-md border border-border bg-card">
        {shown.map((w) => {
          const wsigs = sigs.filter((s) => s.worker_id === w.id);
          const signed = new Set(wsigs.map((s) => s.doc_key)).size;
          return (
            <li key={w.id} className="border-b border-border last:border-0">
              <button type="button" onClick={() => setOpenId(openId === w.id ? null : w.id)} className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-secondary">
                <span className="flex-1 font-medium">{w.full_name} <span className="text-muted-foreground">· {w.dni}</span></span>
                {w.is_master && <Badge>Master</Badge>}
                {!w.active && <Badge variant="destructive">Baja</Badge>}
                <Badge variant="outline" className={signed < PORTAL_DOCUMENTS.length ? 'border-gold' : ''}>{signed}/{PORTAL_DOCUMENTS.length} firmados</Badge>
              </button>
              {openId === w.id && <WorkerDetail worker={w} sigs={wsigs} files={files.filter((f) => f.worker_id === w.id)} onChange={load} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
