import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CheckIn {
  id: string;
  user_id: string;
  venue_id: string;
  comment: string | null;
  visited_at: string;
  created_at: string;
}

export function useMyCheckIns(venueId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['check_ins', user?.id, venueId ?? 'all'],
    enabled: !!user,
    queryFn: async (): Promise<CheckIn[]> => {
      let q = supabase.from('check_ins').select('*').eq('user_id', user!.id).order('visited_at', { ascending: false });
      if (venueId) q = q.eq('venue_id', venueId);
      const { data, error } = await q;
      if (error) throw error;
      return data as CheckIn[];
    },
  });
}

export function useCreateCheckIn() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ venue_id, comment }: { venue_id: string; comment?: string }) => {
      if (!user) throw new Error('Auth required');
      const { error } = await supabase.from('check_ins').insert({ user_id: user.id, venue_id, comment: comment || null });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['check_ins'] }),
  });
}

export function useDeleteCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('check_ins').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['check_ins'] }),
  });
}
