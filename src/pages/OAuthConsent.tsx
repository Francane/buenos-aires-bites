import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, X } from "lucide-react";
import BackgroundFX from "@/components/layout/BackgroundFX";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Falta authorization_id.");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) return setError(error.message || "No se pudo cargar la solicitud.");
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        setError(e?.message || "Error inesperado.");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauth.approveAuthorization(authorizationId)
        : await oauth.denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        return setError(error.message || "No se pudo completar la acción.");
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        return setError("El servidor de autorización no devolvió una URL de redirección.");
      }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message || "Error inesperado.");
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <BackgroundFX />
      <div className="relative w-full max-w-md glass-strong rounded-3xl p-8 shadow-xl border border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-9 w-9 rounded-xl bg-primary/15 inline-flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </span>
          <h1 className="font-display text-2xl font-bold">Conectar a Bites</h1>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        {!error && !details && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando solicitud…
          </div>
        )}

        {details && (
          <>
            <p className="text-sm text-foreground/90 mb-2">
              <span className="font-semibold">{details.client?.name ?? "Una aplicación"}</span> quiere conectarse a tu
              cuenta de Bites.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Podrá usar las herramientas habilitadas actuando como vos: buscar lugares, y leer o crear tus favoritos,
              listas, check-ins y reseñas. No podrá acceder a datos de otros usuarios ni saltarse las políticas de la
              app.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => decide(true)} disabled={busy} className="flex-1">
                {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Aprobar
              </Button>
              <Button onClick={() => decide(false)} disabled={busy} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-1" /> Cancelar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
