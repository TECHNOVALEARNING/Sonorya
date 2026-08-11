-- =========================================================
-- SCHÉMA SQL CLOUDFLARE D1 (SQLITE) — SONORYA BY TECHNOVA
-- =========================================================

-- 1. Table Utilisateurs (Users)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    country TEXT DEFAULT 'Bénin',
    role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
    status TEXT CHECK(status IN ('active', 'banned', 'suspended')) DEFAULT 'active',
    referral_code TEXT UNIQUE,
    bonus_credits INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Chansons / Projets (Songs)
CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
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
    is_favorite INTEGER DEFAULT 0, -- Boolean 0 ou 1
    download_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    price_fcfa INTEGER DEFAULT 2500,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Table Transactions de Paiement (Payments)
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    song_id TEXT,
    reference TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL, -- 'MTN MoMo', 'Moov Money', 'Orange Money', 'Wave', 'Carte Bancaire'
    amount_fcfa INTEGER NOT NULL,
    phone_number TEXT,
    status TEXT CHECK(status IN ('pending', 'successful', 'failed', 'cancelled')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE SET NULL
);


-- 6. Table Pistes Démo (Demo Tracks)
CREATE TABLE IF NOT EXISTS demo_tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    occasion TEXT NOT NULL,
    genre TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 120,
    snippet_description TEXT,
    tempo INTEGER DEFAULT 115,
    key_note TEXT DEFAULT 'C Major',
    cover_url TEXT,
    lyrics TEXT,
    audio_sample_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- INDEX POUR OPTIMISATION DES REQUÊTES (PERFORMANCE)
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON songs(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_song_id ON payments(song_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);

-- =========================================================
-- DONNÉES DÉMO INITIALES (INSERTIONS TEST)
-- =========================================================
INSERT OR IGNORE INTO users (id, email, full_name, role) VALUES 
('user-1', 'client@sonorya.com', 'Koffi Mensah', 'user'),
('user-admin', 'admin@technova.com', 'Admin Technova', 'admin');


INSERT OR IGNORE INTO songs (id, user_id, title, occasion, recipient_name, story, genre, lyrics, audio_url, cover_url, price_fcfa) VALUES 
('song-101', 'user-1', '« Anniversaire de Sarah »', 'Anniversaire', 'Sarah', 'Fêter ses 30 ans à Cotonou avec joie', 'Afrobeat', 'Couplet 1:\nJoyeux anniversaire Sarah\nQue la fête commence!', '/audios/anniversaire_highlife.mp3', '/images/cover_anniversaire_highlife.png', 2500);
