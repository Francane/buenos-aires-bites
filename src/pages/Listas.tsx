import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Globe, Lock, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMyLists, useCreateList, useDeleteList } from '@/hooks/useLists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BackgroundFX from '@/components/layout/BackgroundFX';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';
import { useEffect } from 'react';

const EMOJIS = ['📋', '❤️', '🍕', '🍷', '☕', '🌮', '🥩', '🍣', '🍝', '🥗', '🍰', '🌟'];

export default function Listas() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: lists = [], isLoading } = useMyLists();
  const createList = useCreateList();
  const deleteList = useDeleteList();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('📋');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth', { replace: true });
  }, [user, authLoading, navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createList.mutateAsync({ name: name.trim(), description: description.trim(), is_public: isPublic, cover_emoji: emoji });
      toast.success('Lista creada');
      setOpen(false);
      setName(''); setDescription(''); setEmoji('📋'); setIsPublic(false);
    } catch {
      toast.error('No se pudo crear');
    }
  };

  const handleDelete = async (id: string, listName: string) => {
    if (!confirm(`¿Eliminar la lista "${listName}"?`)) return;
    try {
      await deleteList.mutateAsync(id);
      toast.success('Lista eliminada');
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen relative pb-20">
      <BackgroundFX />
      <Navbar favCount={0} onSearchOpen={() => {}} onAddPlace={() => navigate('/agregar-lugar')} />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Mis listas</h1>
            <p className="text-muted-foreground mt-1">Organizá tus lugares favoritos en colecciones.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Nueva lista</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Crear lista</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Emoji</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => setEmoji(e)}
                        className={`h-9 w-9 rounded-lg text-lg transition-all ${emoji === e ? 'bg-primary/15 ring-2 ring-primary' : 'bg-muted hover:bg-muted/70'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ln">Nombre</Label>
                  <Input id="ln" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Para fechas" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ld">Descripción</Label>
                  <Textarea id="ld" value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Opcional" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lp" className="flex items-center gap-2 cursor-pointer">
                    {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {isPublic ? 'Pública' : 'Privada'}
                  </Label>
                  <Switch id="lp" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
                <Button type="submit" disabled={createList.isPending} className="w-full">
                  {createList.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Crear lista
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : lists.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-display text-xl font-bold">No tenés listas aún</p>
            <p className="text-muted-foreground text-sm mt-1">Creá una para empezar a organizar tus lugares.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative rounded-2xl bg-card border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/lista/${l.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{l.cover_emoji ?? '📋'}</span>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    {l.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {l.is_public ? 'Pública' : 'Privada'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg truncate">{l.name}</h3>
                {l.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{l.description}</p>}
                <p className="text-xs text-muted-foreground mt-3">{l.item_count ?? 0} lugar{l.item_count === 1 ? '' : 'es'}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(l.id, l.name); }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar lista"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
