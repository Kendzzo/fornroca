import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

export function ContractView({ worker }: { worker: Tables<'workers'> }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (worker.contract_path) {
        const { data } = await supabase.storage.from('worker-files').createSignedUrl(worker.contract_path, 3600);
        setUrl(data?.signedUrl ?? null);
      }
      setLoading(false);
    })();
  }, [worker.contract_path]);

  return (
    <section className="space-y-4">
      <h2 className="heading-editorial text-foreground">Tu Contrato</h2>
      {loading ? <Loader2 className="h-8 w-8 animate-spin text-material" /> : !url ? (
        <p className="rounded-md border border-border bg-card p-8 text-center text-lg text-muted-foreground">
          Todavía no hay contrato subido. La empresa lo añadirá pronto.
        </p>
      ) : (
        <>
          <Button asChild size="lg" variant="outline">
            <a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-5 w-5" /> Abrir a pantalla completa</a>
          </Button>
          <iframe src={url} title="Contrato" className="h-[75vh] w-full rounded-md border border-border bg-card" />
        </>
      )}
    </section>
  );
}
