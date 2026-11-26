import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, ChevronRight, Loader2, Upload, Eye } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { PORTAL_DOCUMENTS, PortalDocument, sha256 } from '@/portal/documents';
import type { Tables } from '@/integrations/supabase/types';

type Sig = Tables<'signatures'>;
type WFile = Tables<'worker_files'>;

async function openFile(path: string) {
  const { data } = await supabase.storage.from('worker-files').createSignedUrl(path, 600);
  if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener');
}

function CarnetUpload({ worker, files, onUploaded }: { worker: Tables<'workers'>; files: WFile[]; onUploaded: () => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${worker.id}/carnet/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('worker-files').upload(path, file, { contentType: file.type });
    if (!error) await supabase.from('worker_files').insert({ worker_id: worker.id, kind: 'carnet', path, file_name: file.name });
    setBusy(false);
    if (error) return toast.error('No se pudo subir el archivo.');
    toast.success('Carnet subido');
    onUploaded();
  };
  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary p-4">
      <p className="text-lg font-medium">Paso 1 · Sube una foto o PDF de tu carnet</p>
      <label className="flex h-16 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-material bg-card text-lg">
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />} Hacer foto o elegir archivo
        <input type="file" accept="image/*,application/pdf" className="sr-only" disabled={busy}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }} />
      </label>
      {files.map((f) => (
        <Button key={f.id} variant="ghost" onClick={() => openFile(f.path)} className="w-full justify-start">
          <Eye className="mr-2 h-4 w-4" /> Ver {f.file_name}
        </Button>
      ))}
    </div>
  );
}

function SignForm({ doc, worker, files, onSigned, onFiles }: {
  doc: PortalDocument; worker: Tables<'workers'>; files: WFile[]; onSigned: () => void; onFiles: () => void;
}) {
  const [name, setName] = useState(worker.full_name);
  const [choice, setChoice] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const needsFile = doc.needsUpload && files.length === 0;
  const ready = !!sig && name.trim().length > 2 && (!doc.choices || choice) && !needsFile;

  const sign = async () => {
    if (!ready || !sig) return;
    setBusy(true);
    try {
      const signedAt = new Date().toISOString();
      const statement = doc.choices?.find((c) => c.value === choice)?.statement ?? '';
      const blob = await (await fetch(sig)).blob();
      const path = `${worker.id}/signatures/${doc.key}-${Date.now()}.png`;
      const up = await supabase.storage.from('worker-files').upload(path, blob, { contentType: 'image/png' });
      if (up.error) throw up.error;
      const content_hash = await sha256([doc.key, doc.version, doc.text, statement, name.trim(), worker.dni, signedAt, sig].join('|'));
      const { error } = await supabase.from('signatures').insert({
        worker_id: worker.id, doc_key: doc.key, doc_version: doc.version, choice, signer_name: name.trim(),
        signature_path: path, content_hash, user_agent: navigator.userAgent, signed_at: signedAt,
      });
      if (error) throw error;
      toast.success('¡Firmado!');
      onSigned();
    } catch (e) {
      console.error(e);
      toast.error('No se pudo guardar la firma. Inténtalo otra vez.');
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div className="max-h-64 overflow-y-auto rounded-md border border-border bg-secondary p-5 text-lg leading-relaxed">{doc.text}</div>

      {doc.needsUpload && <CarnetUpload worker={worker} files={files} onUploaded={onFiles} />}

      {doc.choices && (
        <div className="space-y-2">
          <p className="text-lg font-medium">Elige una opción</p>
          <div className="grid grid-cols-2 gap-3">
            {doc.choices.map((c) => (
              <button key={c.value} type="button" onClick={() => setChoice(c.value)} aria-pressed={choice === c.value}
                className={`h-16 rounded-md border-2 text-lg font-medium transition ${choice === c.value ? 'border-foreground bg-foreground text-background' : 'border-border bg-card'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="signer" className="text-lg">Tu nombre completo</Label>
        <Input id="signer" value={name} onChange={(e) => setName(e.target.value)} className="h-14 text-lg" />
      </div>

      <SignaturePad onChange={setSig} />

      <p className="text-sm text-muted-foreground">
        Al pulsar «Firmar» acepto este documento. Se guardará mi firma con la fecha y la hora.
      </p>
      <Button onClick={sign} disabled={!ready || busy} className="h-16 w-full text-xl">
        {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Firmar'}
      </Button>
      {needsFile && <p className="text-center text-muted-foreground">Primero sube tu carnet (paso 1).</p>}
    </div>
  );
}

export function DocumentsView({ worker, onChange }: { worker: Tables<'workers'>; onChange: () => void }) {
  const [sigs, setSigs] = useState<Sig[]>([]);
  const [files, setFiles] = useState<WFile[]>([]);
  const [open, setOpen] = useState<PortalDocument | null>(null);

  const load = useCallback(async () => {
    const [{ data: s }, { data: f }] = await Promise.all([
      supabase.from('signatures').select('*').eq('worker_id', worker.id).order('signed_at', { ascending: false }),
      supabase.from('worker_files').select('*').eq('worker_id', worker.id).eq('kind', 'carnet').order('created_at', { ascending: false }),
    ]);
    setSigs(s ?? []); setFiles(f ?? []);
  }, [worker.id]);
  useEffect(() => { load(); }, [load]);

  const sigFor = (key: string) => sigs.find((s) => s.doc_key === key);
  const pending = PORTAL_DOCUMENTS.filter((d) => !sigFor(d.key)).length;

  if (open) {
    const done = sigFor(open.key);
    return (
      <section className="space-y-6 rounded-md border border-border bg-card p-6 md:p-8">
        <Button variant="ghost" onClick={() => setOpen(null)}>← Volver a la lista</Button>
        <h2 className="heading-section text-foreground">{open.title}</h2>
        {done ? (
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-lg text-foreground"><CheckCircle2 className="h-6 w-6 text-material" />
              Firmado el {new Date(done.signed_at).toLocaleString('es-ES')}
              {done.choice && <> · {open.choices?.find((c) => c.value === done.choice)?.label}</>}
            </p>
            <div className="rounded-md border border-border bg-secondary p-5 text-lg leading-relaxed">{open.text}</div>
            {open.needsUpload && <CarnetUpload worker={worker} files={files} onUploaded={load} />}
          </div>
        ) : (
          <SignForm doc={open} worker={worker} files={files} onFiles={load}
            onSigned={async () => { await load(); onChange(); setOpen(null); }} />
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="heading-editorial text-foreground">Tus Documentos</h2>
      {pending > 0 ? (
        <p role="status" className="flex items-center gap-3 rounded-md bg-gold/20 p-4 text-lg text-foreground">
          <AlertTriangle className="h-6 w-6 shrink-0" /> Tienes {pending} {pending === 1 ? 'documento' : 'documentos'} por firmar. Son obligatorios.
        </p>
      ) : (
        <p className="flex items-center gap-3 rounded-md bg-accent p-4 text-lg"><CheckCircle2 className="h-6 w-6 text-material" /> Todo firmado. ¡Gracias!</p>
      )}
      <ul className="space-y-3">
        {PORTAL_DOCUMENTS.map((d) => {
          const done = !!sigFor(d.key);
          return (
            <li key={d.key}>
              <button type="button" onClick={() => setOpen(d)}
                className="flex w-full items-center gap-4 rounded-md border-2 border-border bg-card p-5 text-left transition hover:border-gold">
                {done ? <CheckCircle2 className="h-8 w-8 shrink-0 text-material" /> : <AlertTriangle className="h-8 w-8 shrink-0 text-gold" />}
                <span className="flex-1">
                  <span className="block text-xl font-medium text-foreground">{d.title}</span>
                  <span className="block text-muted-foreground">{done ? 'Firmado' : d.short}</span>
                </span>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
