import React from 'react';
import { Home, Plus, Compass, Music, Film, BarChart2, Coins, LogOut, Globe, Bell, User, Gift, ArrowRight } from 'lucide-react';
import { Song } from '../../types/melodia';

interface IzimeloWorkspaceProps {
  userSongs: Song[];
  onOpenWizard: () => void;
  onPlaySong: (song: Song) => void;
  onBackToLanding: () => void;
}

export const IzimeloWorkspace: React.FC<IzimeloWorkspaceProps> = ({
  userSongs,
  onOpenWizard,
  onPlaySong,
  onBackToLanding
}) => {
  return (
    <div className="workspace-layout">
      {/* Sidebar (Exact Capture 2) */}
      <aside className="workspace-sidebar">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 32 }}
          onClick={onBackToLanding}
        >
          <div className="wave">
            <i /><i /><i /><i /><i /><i />
          </div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 700 }}>
            Mél<span style={{ color: 'var(--coral)' }}>o</span>dia
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <button className="workspace-nav-item active">
            <Home size={18} />
            <span className="nav-label">Accueil</span>
          </button>

          <button className="workspace-nav-item btn-create-nav" onClick={onOpenWizard}>
            <Plus size={18} />
            <span className="nav-label">Créer</span>
          </button>

          <button className="workspace-nav-item" onClick={onBackToLanding}>
            <Compass size={18} />
            <span className="nav-label">Explorer</span>
          </button>

          <button className="workspace-nav-item" onClick={onBackToLanding}>
            <Music size={18} />
            <span className="nav-label">Mes Musiques</span>
          </button>

          <button className="workspace-nav-item" onClick={onBackToLanding}>
            <Film size={18} />
            <span className="nav-label">Shorts</span>
          </button>

          <button className="workspace-nav-item" onClick={onBackToLanding}>
            <BarChart2 size={18} />
            <span className="nav-label">Analytiques</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', margin: '8px 0', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Coins size={16} style={{ color: 'var(--gold)' }} />
              <span className="nav-label">Notes</span>
            </div>
            <span style={{ background: 'var(--coral)', color: '#120A1E', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>
              1 Note +
            </span>
          </div>
        </nav>

        {/* User Footer Sidebar */}
        <div style={{ paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--coral)', color: '#120A1E', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              P
            </div>
            <div className="nav-label" style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Précieux</div>
              <div style={{ fontSize: 11, color: 'var(--ivory-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                precieux@technova.app
              </div>
            </div>
          </div>

          <button className="workspace-nav-item" style={{ padding: '8px 0' }} onClick={onBackToLanding}>
            <LogOut size={16} />
            <span className="nav-label">Voir la Landing Page</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Dashboard (Capture 2) */}
      <main className="workspace-main">
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 600 }}>
              Bonjour, Précieux 👋
            </h2>
            <div style={{ fontSize: 13, color: 'var(--ivory-dim)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              Dashboard <span style={{ background: 'rgba(47,217,196,0.15)', color: 'var(--teal)', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>● en direct</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(255,107,91,0.15)', border: '1px solid var(--coral)', color: 'var(--coral)', padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Coins size={15} /> 1 Note +
            </div>

            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} />
            </button>

            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--coral)', color: '#120A1E', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              P
            </div>
          </div>
        </div>

        {/* Big Create Action Card (Capture 2) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,91,0.15), rgba(27,16,48,0.9))',
            border: '2px solid var(--coral)',
            borderRadius: 20,
            padding: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            cursor: 'pointer'
          }}
          onClick={onOpenWizard}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--coral-gradient)', color: '#120A1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: 22, color: 'var(--ivory)', marginBottom: 4 }}>Créer ma première chanson</h3>
              <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>Afrobeat, Amapiano, R&B, Zouk, Gospel, Highlife...</p>
            </div>
          </div>

          <ArrowRight size={24} style={{ color: 'var(--coral)' }} />
        </div>

        {/* Gift Surprise Card (Capture 2) */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ fontSize: 32 }}>🎁</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Nous avons un cadeau pour vous !</div>
            <div style={{ fontSize: 13, color: 'var(--ivory-dim)' }}>Cliquez pour découvrir votre surprise de bienvenue</div>
            <div style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 700, marginTop: 4 }}>● Expire dans 26:41 min</div>
          </div>
        </div>

        {/* Recent Songs Section */}
        <div>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>Chansons récents</h3>

          {userSongs.length === 0 ? (
            <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(244,239,230,0.08)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Music size={28} />
              </div>
              <h4 style={{ fontSize: 18, marginBottom: 6 }}>Pas encore de chanson</h4>
              <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 20 }}>Créez votre tout premier morceau sur-mesure dès maintenant.</p>
              <button className="btn-coral" onClick={onOpenWizard}>
                Créer ma première chanson <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
              {userSongs.map((song) => (
                <div key={song.id} className="izimelo-demo-card" onClick={() => onPlaySong(song)}>
                  <img src={song.coverUrl} alt={song.title} />
                  <div className="izimelo-demo-overlay">
                    <div style={{ alignSelf: 'flex-start' }}>
                      <button className="izimelo-play-btn">
                        <Plus size={18} />
                      </button>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>{song.occasion}</div>
                      <h4 style={{ fontSize: 15, margin: '2px 0' }}>{song.title}</h4>
                      <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>Pour {song.recipientName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
