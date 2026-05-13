import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCheckIn, useMyCheckIns } from '@/hooks/useCheckIns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  venueId: string;
  venueName: string;
  className?: string;
}

export default function CheckInButton({ venueId, venueName, className }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const { data: checkIns = [] } = useMyCheckIns(venueId);
  const create = useCreateCheckIn();
  const visited = checkIns.length > 0;

  if (!user) {
    return (
      <button
        onClick={() => navigate('/auth')}
        className={cn(
          'inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border bg-background text-foreground border-border hover:bg-muted transition-all',
          className,
        )}
      >
        <MapPin className="h-4 w-4" />
        Check-in
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create.mutateAsync({ venue_id: venueId, comment: comment.trim() });
      toast.success('¡Check-in registrado!');
      setOpen(false);
      setComment('');
    } catch {
      toast.error('No se pudo registrar el check-in');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all',
            visited
              ? 'bg-sage/10 text-sage border-sage/30'
              : 'bg-background text-foreground border-border hover:bg-muted',
            className,
          )}
        >
          {visited ? <CheckCircle2 className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          {visited ? `Visitado ×${checkIns.length}` : 'Check-in'}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar visita</DialogTitle>
          <DialogDescription>Marcá que estuviste en {venueName}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="¿Qué tal la experiencia? (opcional)"
            rows={3}
          />
          <Button type="submit" disabled={create.isPending} className="w-full">
            {create.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Confirmar check-in
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
