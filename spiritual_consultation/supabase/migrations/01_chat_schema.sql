-- schema.sql: BioPara Spiritual Consultations and Messages
-- Run this in your Supabase SQL Editor

-- 1. Consultations Table
CREATE TABLE public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Messages Table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    is_agent BOOLEAN DEFAULT false,
    recommended_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Realtime
-- This ensures StreamBuilder will receive new messages instantly
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE consultations;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Ensure users only see/insert their own data)

-- Consultations Policies
CREATE POLICY "Users can view their own consultations" 
    ON public.consultations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultations" 
    ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view messages of their consultations" 
    ON public.messages FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.consultations 
            WHERE id = messages.consultation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages into their consultations" 
    ON public.messages FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND 
        EXISTS (
            SELECT 1 FROM public.consultations 
            WHERE id = consultation_id AND user_id = auth.uid()
        )
    );
