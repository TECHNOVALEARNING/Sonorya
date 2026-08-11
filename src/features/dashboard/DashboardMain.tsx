import React, { useState } from 'react';
import { Play, Search, Edit2, LogOut, Save, X } from 'lucide-react';
import { Song, UserProfile } from '../../types/melodia';
import { useToast } from '../../components/ToastProvider';
import { useTranslation } from '../../i18n/LanguageContext';
import { cleanSongTitle } from '../../services/d1Service';

interface MainProps {
  user: UserProfile;
  orders: Song[];
  onPlaySong: (song: Song) => void;
  onOpenCreate: () => void;
  currentView: string;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onLogout?: () => void;
}

export const LANDING_SAMPLE_SONGS: Song[] = [
  {
    id: 'sample-annif',
    title: 'Joyeux Anniversaire Sarah',
    recipientName: 'Sarah',
    occasion: 'Anniversaire',
    genre: 'Amapiano',
    voiceGender: 'Féminine',
    language: 'Français',
    story: 'Une chanson festive et entraînante pour l\'anniversaire de Sarah avec des rythmes Amapiano joyeux.',
    lyrics: '',
    audioUrl: '/audios/Annif.mp3',
    coverUrl: '/images/cover_amapiano_party.png',
    durationSeconds: 154,
    createdAt: '2026-08-01',
    status: 'completed',
    isFavorite: true
  },
  {
    id: 'sample-mariage',
    title: 'Pour mon épouse Christelle',
    recipientName: 'Christelle',
    occasion: 'Mariage',
    genre: 'Afrobeat',
    voiceGender: 'Masculine',
    language: 'Français',
    story: 'Un hymne d\'amour vibrant célébrant une belle union en musique Afrobeat.',
    lyrics: '',
    audioUrl: '/audios/marriage.mp3',
    coverUrl: '/images/cover_mariage_afrobeat.png',
    durationSeconds: 192,
    createdAt: '2026-08-02',
    status: 'completed',
    isFavorite: false
  },
  {
    id: 'sample-hommage',
    title: 'Hommage à Grand-Père',
    recipientName: 'Grand-Père',
    occasion: 'Hommage',
    genre: 'Acoustique',
    voiceGender: 'Duo / Mixte',
    language: 'Français',
    story: 'Un hommage doux et émouvant à la guitare acoustique.',
    lyrics: '',
    audioUrl: '/audios/grand pere.mp3',
    coverUrl: '/images/cover_hommage_acoustique.png',
    durationSeconds: 168,
    createdAt: '2026-08-03',
    status: 'completed',
    isFavorite: false
  },
  {
    id: 'sample-bac',
    title: 'Félicitations pour le BAC',
    recipientName: 'Alexandre',
    occasion: 'Diplôme',
    genre: 'Gospel',
    voiceGender: 'Duo / Mixte',
    language: 'Français',
    story: 'Chanson d\'encouragement et d\'action de grâce pour la réussite au BAC.',
    lyrics: '',
    audioUrl: '/audios/bac.mp3',
    coverUrl: '/images/cover_bac_gospel.png',
    durationSeconds: 241,
    createdAt: '2026-08-04',
    status: 'completed',
    isFavorite: false
  }
];

export const DashboardMain: React.FC<MainProps> = ({ user, orders, onPlaySong, onOpenCreate, currentView, onUpdateUser, onLogout }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: user.fullName || '', phone: user.phone || '' });
  const { showToast } = useToast();

  // Filter and deduplicate user created orders belonging to THIS user (including session songs)
  const uniqueOrders = React.useMemo(() => {
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();
    const list: Song[] = [];

    for (const song of orders) {
      // Include songs created by this user OR created in current session
      if (song.userId && user.id && song.userId !== user.id && song.userId !== 'user-current') {
        continue;
      }
      const titleKey = (song.title || '').toLowerCase().trim();
      if (!seenIds.has(song.id) && (!titleKey || !seenTitles.has(titleKey))) {
        seenIds.add(song.id);
        if (titleKey) seenTitles.add(titleKey);
        list.push(song);
      }
    }
    return list;
  }, [orders, user.id]);

  // Combine user songs with landing sample songs for Top Community Creations
  const communityTracks = React.useMemo(() => {
    const combined = [...uniqueOrders, ...LANDING_SAMPLE_SONGS];
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();
    const list: Song[] = [];

    for (const song of combined) {
      const titleKey = (song.title || '').toLowerCase().trim();
      if (!seenIds.has(song.id) && (!titleKey || !seenTitles.has(titleKey))) {
        seenIds.add(song.id);
        if (titleKey) seenTitles.add(titleKey);
        list.push(song);
      }
    }
    return list;
  }, [uniqueOrders]);
  
  const filteredOrders = uniqueOrders.filter(o => 
    o.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const latestOrder = uniqueOrders.length > 0 ? uniqueOrders[0] : null;

  const renderGrid = (title: string, items: Song[], emptyMessage: string, icon: React.ReactNode, showCreateBtn = false) => (
    <>
      <div className="dashboard-section-title">{title}</div>
      {items.length > 0 ? (
        <div className="dashboard-grid">
          {items.map(order => (
            <div key={order.id} className="dashboard-card" onClick={() => onPlaySong(order)} style={{ cursor: 'pointer' }}>
              <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                <img src={order.coverUrl || '/images/cover_amapiano_party.png'} alt={order.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2DD4BF, #0EA5E9)',
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  transition: 'transform 0.2s ease'
                }}>
                  <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />
                </div>
              </div>
              <div className="dashboard-card-title">{cleanSongTitle(order.title)}</div>
              <div className="dashboard-card-subtitle">{order.genre}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16, marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212,161,57,0.12)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(212,161,57,0.25)' }}>
            {icon || <Play size={28} fill="currentColor" style={{ marginLeft: 3 }} />}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{t('dashboard.nothingToShow')}</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: showCreateBtn ? 24 : 0, maxWidth: 300, margin: '0 auto' }}>
            {emptyMessage}
          </p>
          {showCreateBtn && (
            <button className="btn-coral" onClick={onOpenCreate} style={{ marginTop: 24 }}>
              {t('dashboard.createFirstSong')}
            </button>
          )}
        </div>
      )}
    </>
  );

  const renderOccasions = () => (
    <>
      <div className="dashboard-section-title">{t('dashboard.occasionsAndTemplates')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 14, marginBottom: 40 }}>
        {[
          { label: 'Afrobeat', color: 'linear-gradient(135deg, #F97316, #EA580C)' },
          { label: 'Amapiano', color: 'linear-gradient(135deg, #38BDF8, #0284C7)' },
          { label: 'Zouk / R&B', color: 'linear-gradient(135deg, #C084FC, #9333EA)' },
          { label: 'Electro Pop', color: 'linear-gradient(135deg, #818CF8, #4F46E5)' },
          { label: 'Gospel HD', color: 'linear-gradient(135deg, #2DD4BF, #0D9488)' },
          { label: 'Highlife', color: 'linear-gradient(135deg, #F472B6, #DB2777)' },
        ].map((occ) => (
          <div key={occ.label} onClick={onOpenCreate} style={{
            background: occ.color,
            height: 80,
            borderRadius: 14,
            padding: 14,
            fontWeight: 800,
            fontSize: 14,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'flex-end',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease'
          }}>
            {occ.label}
          </div>
        ))}
      </div>
    </>
  );

  const renderTopCommunity = () => (
    <>
      <div className="dashboard-section-title">{t('dashboard.topCommunity')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
        {communityTracks.map((track, i) => (
          <div 
            key={track.id} 
            className="dashboard-list-item" 
            onClick={() => onPlaySong(track)} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s ease' }}
          >
            <div style={{ width: 24, textAlign: 'center', color: 'var(--gold)', fontSize: 14, fontWeight: 800 }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <img 
              src={track.coverUrl || '/images/cover_amapiano_party.png'} 
              alt={track.title} 
              style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} 
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {track.title}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {track.genre} • {t('home.for')} {track.recipientName}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginRight: 8, fontWeight: 600 }}>
              {track.durationSeconds ? `${Math.floor(track.durationSeconds / 60)}:${(track.durationSeconds % 60).toString().padStart(2, '0')}` : '2:30'}
            </div>
            <button className="play-btn" style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Play size={14} fill="currentColor" style={{ marginLeft: 2 }} />
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <main className="dashboard-main">
      {currentView === 'home' && (
        <>
          <div className="dashboard-hero-banner">
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {t('dashboard.latestCreation')}
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, marginBottom: 8, fontFamily: 'Fraunces', letterSpacing: '-0.02em' }}>
              {latestOrder ? cleanSongTitle(latestOrder.title) : t('dashboard.welcome')}
            </h2>
            <div style={{ color: 'var(--gold)', fontSize: 16, marginBottom: 24, fontWeight: 500 }}>
              {latestOrder ? `${t('home.for')} ${latestOrder.recipientName}` : t('dashboard.startCreating')}
            </div>
            <div>
              {latestOrder ? (
                <button className="btn-coral" style={{ borderRadius: 99, padding: '12px 32px', fontSize: 15 }} onClick={() => onPlaySong(latestOrder)}>
                  {t('dashboard.listen')} <Play size={16} fill="currentColor" />
                </button>
              ) : (
                <button className="btn-coral" style={{ borderRadius: 99, padding: '12px 32px', fontSize: 15 }} onClick={onOpenCreate}>
                  {t('dashboard.createFirstSong')}
                </button>
              )}
            </div>
          </div>
          {renderGrid(t('dashboard.myRecentCreations'), orders.slice(0, 6), t('dashboard.noRecent'), undefined, false)}
          {renderOccasions()}
          {renderTopCommunity()}
        </>
      )}

      {currentView === 'explore' && (
        <>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, fontFamily: 'Fraunces' }}>{t('dashboard.explore')}</h2>
          {renderOccasions()}
          {renderTopCommunity()}
        </>
      )}

      {currentView === 'recent' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Fraunces', margin: 0 }}>{t('dashboard.myRecent')}</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder={t('dashboard.searchSong')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '10px 16px 10px 36px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, width: 240 }}
              />
            </div>
          </div>
          {renderGrid(t('dashboard.allCreations'), filteredOrders, searchQuery ? t('dashboard.noSearchMatch') : t('dashboard.noCreationsYet'), <Play size={32} />, !searchQuery)}
        </>
      )}

      {currentView === 'favorites' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Fraunces', margin: 0 }}>{t('dashboard.myFavorites')}</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder={t('dashboard.searchFavorite')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '10px 16px 10px 36px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, width: 240 }}
              />
            </div>
          </div>
          {renderGrid(t('dashboard.likedTracks'), filteredOrders.filter(o => o.isFavorite), searchQuery ? t('dashboard.noFavoriteMatch') : t('dashboard.noFavoritesYet'), <Play size={32} />)}
        </>
      )}

      {currentView === 'albums' && (
        <>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, fontFamily: 'Fraunces' }}>{t('dashboard.albumsAndPacks')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { id: 'p1', title: 'Pack Mariage', cover: '/images/cover_mariage_afrobeat.png' },
              { id: 'p2', title: 'Pack Anniversaire', cover: '/images/cover_anniversaire_highlife.png' },
              { id: 'p3', title: 'Pack Saint-Valentin', cover: '/images/cover_dot_zouk.png' }
            ].map(pack => (
              <div key={pack.id} className="dashboard-card" style={{ cursor: 'default' }}>
                <img src={pack.cover} alt={pack.title} style={{ aspectRatio: '1', borderRadius: 12, objectFit: 'cover', width: '100%', marginBottom: 16 }} />
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--ivory)' }}>{pack.title}</div>
                <button className="btn-glass" style={{ width: '100%', justifyContent: 'center' }} onClick={onOpenCreate}>
                  {t('dashboard.usePack')}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {currentView === 'profile' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Fraunces', margin: 0 }}>{t('dashboard.myProfile')}</h2>
            {!isEditingProfile && (
              <button 
                onClick={() => setIsEditingProfile(true)}
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--ivory)', padding: '10px 20px', borderRadius: 99, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}
              >
                <Edit2 size={16} /> {t('dashboard.edit')}
              </button>
            )}
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, maxWidth: 600 }}>
            {isEditingProfile ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateUser) onUpdateUser(editForm);
                setIsEditingProfile(false);
                showToast(t('dashboard.profileUpdated'), 'success');
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--ivory-dim)', marginBottom: 8 }}>{t('dashboard.fullName')}</label>
                    <input 
                      type="text" 
                      value={editForm.fullName} 
                      onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                      style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8 }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--ivory-dim)', marginBottom: 8 }}>{t('dashboard.phone')}</label>
                    <input 
                      type="tel" 
                      value={editForm.phone} 
                      onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn-coral">
                    <Save size={16} /> {t('dashboard.save')}
                  </button>
                  <button type="button" onClick={() => { setIsEditingProfile(false); setEditForm({ fullName: user.fullName || '', phone: user.phone || '' }); }} className="btn-glass">
                    <X size={16} /> {t('dashboard.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#120A1E' }}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.fullName || t('dashboard.user')}</h3>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{user.email}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 4 }}>{user.phone || t('dashboard.noPhone')}</div>
                  <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('dashboard.account')} {user.role === 'admin' ? t('dashboard.admin') : t('dashboard.standard')}
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32, marginTop: 32 }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 8 }}>{t('dashboard.songsCreated')}</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{orders.length}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 8 }}>{t('dashboard.favoriteSongs')}</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{orders.filter(o => o.isFavorite).length}</div>
              </div>
            </div>
            
            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => {
                if (window.confirm(t('dashboard.logoutConfirm'))) {
                  if (onLogout) onLogout();
                }
              }} style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>
                <LogOut size={18} /> {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </>
      )}

      {currentView === 'settings' && (
        <>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, fontFamily: 'Fraunces' }}>{t('dashboard.settings')}</h2>
          <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{t('dashboard.notifications')}</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
                {t('dashboard.emailWhenReady')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'rgba(255,255,255,0.8)', marginTop: 12 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
                {t('dashboard.specialOffers')}
              </label>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{t('dashboard.languagePref')}</h3>
              <select style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8, outline: 'none' }}>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--coral)' }}>{t('dashboard.dangerZone')}</h3>
              <button onClick={() => {
                if (window.confirm(t('dashboard.deleteConfirm'))) {
                  showToast(t('dashboard.accountDeleted'), 'success');
                  if (onLogout) onLogout();
                }
              }} style={{ width: '100%', padding: '12px', background: 'rgba(255,107,91,0.1)', border: '1px solid rgba(255,107,91,0.2)', color: 'var(--coral)', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                {t('dashboard.deleteAccount')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Dashboard internal footer to finish the scroll gracefully */}
      <div style={{ textAlign: 'center', padding: '20px 0 10px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
        © {new Date().getFullYear()} Mélodia AI. {t('dashboard.allRightsReserved')}
      </div>
    </main>
  );
};
