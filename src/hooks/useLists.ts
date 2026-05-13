import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface List {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  cover_emoji: string | null;
  created_at: string;
  updated_at: string;
  item_count?: number;
}

export interface ListItem {
  id: string;
  list_id: string;
  venue_id: string;
  note: string | null;
  created_at: string;
}

export function useMyLists() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['lists', 'mine', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<List[]> => {
      const { data, error } = await supabase
        .from('lists')
        .select('*, list_items(count)')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((l: any) => ({
        ...l,
        item_count: l.list_items?.[0]?.count ?? 0,
      }));
    },
  });
}

export function useList(id: string | undefined) {
  return useQuery({
    queryKey: ['list', id],
    enabled: !!id,
    queryFn: async () => {
      const [{ data: list, error: e1 }, { data: items, error: e2 }] = await Promise.all([
        supabase.from('lists').select('*').eq('id', id!).maybeSingle(),
        supabase.from('list_items').select('*').eq('list_id', id!).order('created_at', { ascending: false }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { list: list as List | null, items: (items ?? []) as ListItem[] };
    },
  });
}

export function useCreateList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string; is_public?: boolean; cover_emoji?: string }) => {
      if (!user) throw new Error('Auth required');
      const { data, error } = await supabase
        .from('lists')
        .insert({ user_id: user.id, ...input })
        .select()
        .single();
      if (error) throw error;
      return data as List;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] }),
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lists').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lists'] }),
  });
}

export function useAddVenueToList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ list_id, venue_id }: { list_id: string; venue_id: string }) => {
      const { error } = await supabase.from('list_items').insert({ list_id, venue_id });
      if (error && !error.message.includes('duplicate')) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['list', vars.list_id] });
      qc.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useRemoveListItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ list_id, venue_id }: { list_id: string; venue_id: string }) => {
      const { error } = await supabase.from('list_items').delete().eq('list_id', list_id).eq('venue_id', venue_id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['list', vars.list_id] });
      qc.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}
