-- =========================================================
-- SCHÉMA SQL POSTGRESQL (SUPABASE) — SONORYA BY TECHNOVA
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table Utilisateurs (Users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    country TEXT DEFAULT 'Bénin',
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
    status TEXT CHECK(status IN ('active', 'banned', 'suspended')) DEFAULT 'active',
    referral_code TEXT UNIQUE,
    bonus_credits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Chansons / Projets (Songs)
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    occasion TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    story TEXT,
    genre TEXT NOT NULL,
    voice_gender TEXT DEFAULT 'Duo / Mixte',
    language TEXT DEFAULT 'Français',
    vibe TEXT DEFAULT 'Joyeux & Festif',
    tempo INTEGER DEFAULT 115,
    duration_seconds INTEGER DEFAULT 120,
    lyrics TEXT,
    audio_url TEXT,
    preview_audio_url TEXT,
    cover_url TEXT,
    status TEXT CHECK(status IN ('pending', 'generating', 'completed', 'failed', 'preview_ready', 'payment_pending')) DEFAULT 'completed',
    is_favorite BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    price_fcfa INTEGER DEFAULT 2500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table Transactions de Paiement (Payments)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
    reference TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL,
    amount_fcfa INTEGER NOT NULL,
    phone_number TEXT,
    status TEXT CHECK(status IN ('pending', 'successful', 'failed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- TRIGGERS (Création automatique du profil depuis auth.users)
-- =========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- =========================================================
-- SÉCURITÉ : ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les musiques
CREATE POLICY "Users can view their own songs" ON public.songs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own songs" ON public.songs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own songs" ON public.songs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own songs" ON public.songs FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les paiements
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
