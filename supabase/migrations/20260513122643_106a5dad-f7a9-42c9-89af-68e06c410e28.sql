-- Lists (collections)
CREATE TABLE public.lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  cover_emoji TEXT DEFAULT '📋',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public lists viewable by all, private by owner"
ON public.lists FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own lists"
ON public.lists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
ON public.lists FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
ON public.lists FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_lists_updated_at
BEFORE UPDATE ON public.lists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- List items
CREATE TABLE public.list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (list_id, venue_id)
);

ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "List items follow parent list visibility"
ON public.list_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lists l
    WHERE l.id = list_items.list_id
      AND (l.is_public = true OR l.user_id = auth.uid())
  )
);

CREATE POLICY "List owner can add items"
ON public.list_items FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.lists l WHERE l.id = list_id AND l.user_id = auth.uid())
);

CREATE POLICY "List owner can update items"
ON public.list_items FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.lists l WHERE l.id = list_items.list_id AND l.user_id = auth.uid())
);

CREATE POLICY "List owner can remove items"
ON public.list_items FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.lists l WHERE l.id = list_items.list_id AND l.user_id = auth.uid())
);

CREATE INDEX idx_list_items_list_id ON public.list_items(list_id);
CREATE INDEX idx_list_items_venue_id ON public.list_items(venue_id);

-- Check-ins
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  venue_id UUID NOT NULL,
  comment TEXT,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own check-ins"
ON public.check_ins FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins"
ON public.check_ins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins"
ON public.check_ins FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX idx_check_ins_venue_id ON public.check_ins(venue_id);