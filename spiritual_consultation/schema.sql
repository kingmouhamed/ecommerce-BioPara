-- Create a table for consultations
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  consultant_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table for messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER REFERENCES consultations(id),
  sender_id UUID REFERENCES auth.users(id),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for consultations
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own consultations." ON consultations FOR SELECT USING (auth.uid() = user_id OR auth.uid() = consultant_id);
CREATE POLICY "Users can create their own consultations." ON consultations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in their consultations." ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM consultations WHERE id = messages.consultation_id
  )
);
CREATE POLICY "Users can send messages in their consultations." ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM consultations WHERE id = messages.consultation_id
  )
);
