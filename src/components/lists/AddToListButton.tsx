import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Plus, Loader2, Check, Globe, Lock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useMyLists, useCreateList, useAddVenueToList } from '@/hooks/useLists';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  venueId: string;
  className?: string;
}

export default function AddToListButton({ venueId, className }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const { data: lists = [], isLoading } = useMyLists();
  const createList = useCreateList();
  const addItem = useAddVenueToList();

  const handleAdd = async (listId: string) => {
    try {
      await addItem.mutateAsync({ list_id: listId, venue_id: venueId });
      setAdded(prev => new Set(prev).add(listId));
      toast.success('Agregado a la lista');
    } catch {
      toast.error('No se pudo agregar');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const list = await createList.mutateAsync({ name: newName.trim(), is_public: isPublic });
      await addItem.mutateAsync({ list_id: list.id, venue_id: venueId });
      setAdded(prev => new Set(prev).add(list.id));
      setNewName('');
      setCreating(false);
      toast.success('Lista creada');
    } catch {
      toast.error('No se pudo crear la lista');
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate('/auth')}
        className={cn(
          'inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border bg-background text-foreground border-border hover:bg-muted transition-all',
          className,
        )}
      >
        <Bookmark className="h-4 w-4" />
        Guardar
      </button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border bg-background text-foreground border-border hover:bg-muted transition-all',
            className,
          )}
        >
          <Bookmark className="h-4 w-4" />
          Guardar
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Tus listas
        </div>
        <div className="max-h-56 overflow-y-auto space-y-0.5">
          {isLoading ? (
            <div className="py-4 flex justify-center"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
          ) : lists.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">Aún no tenés listas. Creá la primera 👇</p>
          ) : (
            lists.map(l => (
              <button
                key={l.id}
                onClick={() => handleAdd(l.id)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted text-sm text-left transition-colors"
              >
                <span className="text-base">{l.cover_emoji ?? '📋'}</span>
                <span className="flex-1 truncate font-medium">{l.name}</span>
                {l.is_public ? <Globe className="h-3 w-3 text-muted-foreground" /> : <Lock className="h-3 w-3 text-muted-foreground" />}
                {added.has(l.id) && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))
          )}
        </div>
        <div className="border-t border-border mt-2 pt-2">
          {creating ? (
            <form onSubmit={handleCreate} className="space-y-2 p-1">
              <Input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nombre de la lista"
                className="h-9"
              />
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="pub" className="flex items-center gap-1.5 cursor-pointer">
                  {isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {isPublic ? 'Pública' : 'Privada'}
                </Label>
                <Switch id="pub" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <div className="flex gap-1.5">
                <Button type="submit" size="sm" disabled={createList.isPending} className="flex-1">
                  {createList.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  Crear
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted text-sm text-primary font-medium"
            >
              <Plus className="h-4 w-4" />
              Nueva lista
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
