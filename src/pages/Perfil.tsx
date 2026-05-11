import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, LogOut, ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BackgroundFX from '@/components/layout/BackgroundFX';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth', { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { count }] = await Promise.all([
        supabase.from('profiles').select('display_name, bio, avatar_url').eq('user_id', user.id).maybeSingle(),
        supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      if (profile) {
        setDisplayName(profile.display_name ?? '');
        setBio(profile.bio ?? '');
        setAvatarUrl(profile.avatar_url ?? '');
      }
      setFavCount(count ?? 0);
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, bio, avatar_url: avatarUrl })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) toast.error('No se pudo guardar el perfil');
    else toast.success('Perfil actualizado');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initials = (displayName || user.email || '?').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen relative pb-20">
      <BackgroundFX />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-8 border border-border/60">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold truncate">{displayName || 'Tu perfil'}</h1>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Heart className="h-3.5 w-3.5" /> Favoritos
              </div>
              <div className="text-2xl font-bold">{favCount}</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="text-muted-foreground text-xs mb-1">Miembro desde</div>
              <div className="text-sm font-semibold">{new Date(user.created_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dn">Nombre público</Label>
                <Input id="dn" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="av">Avatar URL</Label>
                <Input id="av" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Contanos qué te gusta comer" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Guardar
                </Button>
                <Button type="button" variant="outline" onClick={async () => { await signOut(); navigate('/'); }} className="gap-2">
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
