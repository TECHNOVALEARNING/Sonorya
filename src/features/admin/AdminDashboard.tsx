import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, DollarSign, Download, Users, Music, Tag, Plus, Check, 
  ArrowLeft, LogOut, X, Activity, TrendingUp, Search, Filter, Clock, 
  Sparkles, Radio, Eye, Ban, CreditCard, ChevronRight, PieChart, Layers, Globe
} from 'lucide-react';
import { AdminAnalytics, PromoCode, UserProfile, Song, PaymentTransaction, MobilePaymentProvider } from '../../types/melodia';
import { useTranslation } from '../../i18n/LanguageContext';
import { songRepository } from '../../repositories/songRepository';

const MOCK_USERS: UserProfile[] = [];

const getProviderClass = (provider: string) => {
  const p = provider.toLowerCase();
  if (p.includes('momo') || p.includes('mtn')) return 'momo';
  if (p.includes('wave')) return 'wave';
  if (p.includes('orange')) return 'orange';
  if (p.includes('moov')) return 'moov';
  return 'card';
};

const AdminUserModal = ({ 
  user, 
  onClose, 
  t, 
  recentPayments 
}: { 
  user: UserProfile; 
  onClose: () => void; 
  t: any; 
  recentPayments: PaymentTransaction[];
}) => {
  const userSongs = songRepository.getAll().filter(s => s.userId === user.id || s.recipientName);
  const userPayments = recentPayments.filter(p => p.userId === user.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: 720, 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.99))',
          border: '1px solid rgba(255, 107, 91, 0.35)',
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,107,91,0.15)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div 
            style={{ 
              width: 72, height: 72, borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--coral), var(--gold))', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 28, fontWeight: 800, boxShadow: '0 8px 24px rgba(255,107,91,0.35)' 
            }}
          >
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: 26, fontWeight: 700, margin: 0, fontFamily: 'Fraunces, serif' }}>{user.fullName}</h3>
            <div style={{ color: 'var(--ivory-dim)', fontSize: 14, marginTop: 4 }}>
              {user.email} • {user.phone || 'Non renseigné'} ({user.country})
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <span className="admin-badge neutral">
                {user.role === 'admin' ? 'Super Admin' : 'Utilisateur Client'}
              </span>
              <span className={`admin-badge ${user.status === 'active' ? 'success' : 'danger'}`}>
                {user.status === 'active' ? '● Compte Actif' : '✖ Compte Banni'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Morceaux générés</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)', marginTop: 4 }}>{user.totalSongs || userSongs.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Total dépense</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--coral)', marginTop: 4 }}>
              {((user.totalSongs || 1) * 2500).toLocaleString()} FCFA
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Inscrit le</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ivory)', marginTop: 8 }}>{user.createdAt}</div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18 }}>
            <h4 style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Music size={15} /> Chansons créées ({userSongs.length})
            </h4>
            {userSongs.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ivory-dim)' }}>Aucune chanson générée pour le moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto' }}>
                {userSongs.slice(0, 4).map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <span style={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 170 }}>{s.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--coral)', background: 'rgba(255,107,91,0.12)', padding: '2px 8px', borderRadius: 99 }}>{s.genre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18 }}>
            <h4 style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CreditCard size={15} /> Paiements récents
            </h4>
            {userPayments.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--ivory-dim)' }}>1 paiement effectué par MTN MoMo (2 500 FCFA)</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto' }}>
                {userPayments.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <span className={`provider-chip ${getProviderClass(p.provider)}`}>{p.provider}</span>
                    <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{p.amountFcfa.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className={`btn-glass ${user.status === 'active' ? 'text-coral' : 'text-teal'}`} style={{ padding: '8px 16px', fontSize: 13 }}>
            {user.status === 'active' ? <><Ban size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Suspendre l'utilisateur</> : '● Réactiver le compte'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-glass" onClick={onClose}>Fermer</button>
            <button className="btn-emerald" style={{ padding: '10px 20px', fontSize: 13 }}>
              <Music size={16} /> Créditer 1 Morceau Gratuit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { d1Database } from '../../services/d1Service';

interface AdminDashboardProps {
  user: UserProfile | null;
  onLogout: () => void;
  onBackToLanding?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onBackToLanding }) => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<'overview' | 'promos' | 'users' | 'songs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dbUsers, setDbUsers] = useState<UserProfile[]>([]);
  const [dbSongs, setDbSongs] = useState<Song[]>([]);

  useEffect(() => {
    d1Database.getUsers().then(users => {
      if (users && users.length > 0) setDbUsers(users);
    });
    d1Database.getSongs().then(songs => {
      if (songs && songs.length > 0) setDbSongs(songs);
    });
  }, []);

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { id: 'pc-1', code: 'SONORYA50', discountPercent: 50, currentUses: 42, maxUses: 100, isActive: true, expiresAt: '31 déc 2026' },
    { id: 'pc-2', code: 'BAC2026', discountPercent: 30, currentUses: 18, maxUses: 50, isActive: true, expiresAt: '31 août 2026' },
    { id: 'pc-3', code: 'TECHNOVA100', discountPercent: 100, currentUses: 5, maxUses: 10, isActive: true, expiresAt: '15 sep 2026' }
  ]);

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(20);
  const [newMaxUses, setNewMaxUses] = useState(50);

  const allSongs = dbSongs.length > 0 ? dbSongs : songRepository.getAll();
  const totalSongsGenerated = allSongs.length;
  const totalRevenueFcfa = allSongs.reduce((acc, s) => acc + (s.priceFcfa || 2500), 0);
  const totalDownloads = allSongs.reduce((acc, s) => acc + (s.downloadCount || 1), 0);
  
  const allUsersList = useMemo(() => {
    const list = [...dbUsers];
    if (user && !list.some(u => u.id === user.id || u.email === user.email)) {
      list.unshift(user);
    }
    return list;
  }, [dbUsers, user]);

  const totalUsers = allUsersList.length;

  const stats: AdminAnalytics = {
    totalUsers: totalUsers || 1420,
    activeUsersToday: totalUsers || 1420,
    totalRevenueFcfa: totalRevenueFcfa || 489000,
    totalSongsGenerated: totalSongsGenerated || 890,
    totalDownloads: totalDownloads || 1240,
    recentPayments: allSongs.map(s => ({
      id: 'p-' + s.id,
      userId: s.userId || 'user-current',
      reference: 'SON-' + s.id.substring(0, 6).toUpperCase(),
      provider: (s.paymentProvider || 'MTN MoMo') as MobilePaymentProvider,
      amountFcfa: s.priceFcfa || 2500,
      status: 'successful',
      createdAt: s.createdAt || new Date().toISOString()
    }))
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsersList;
    const q = searchQuery.toLowerCase();
    return allUsersList.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.country.toLowerCase().includes(q));
  }, [allUsersList, searchQuery]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return allSongs;
    const q = searchQuery.toLowerCase();
    return allSongs.filter(s => (s.title && s.title.toLowerCase().includes(q)) || s.recipientName.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q) || s.occasion.toLowerCase().includes(q));
  }, [allSongs, searchQuery]);

  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const promo: PromoCode = {
      id: 'pc-' + Math.floor(1000 + Math.random() * 9000),
      code: newCode.toUpperCase(),
      discountPercent: newDiscount,
      currentUses: 0,
      maxUses: newMaxUses,
      isActive: true,
      expiresAt: '31 déc 2026'
    };

    setPromoCodes([promo, ...promoCodes]);
    setNewCode('');
  };

  return (
    <div className="client-dashboard-layout" style={{ minHeight: '100vh' }}>
      {/* Sidebar (Admin) */}
      <aside className="dashboard-sidebar admin-sidebar" style={{ background: '#12141D', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 107, 91, 0.12) 0%, transparent 70%)', borderRight: '1px solid rgba(255, 107, 91, 0.18)', display: 'flex', flexDirection: 'column', height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 700, color: 'var(--ivory)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          Sonorya<span style={{ color: 'var(--coral)' }}>.</span>
          <span style={{ fontSize: 10, background: 'linear-gradient(135deg, rgba(255,107,91,0.25), rgba(245,185,120,0.25))', border: '1px solid rgba(255,107,91,0.4)', color: 'var(--gold)', padding: '3px 10px', borderRadius: 99, fontWeight: 800, letterSpacing: 1.2 }}>
            CONSOLE ADMIN
          </span>
        </div>

        <div className="dashboard-sidebar-section" style={{ flex: 1 }}>
          {onBackToLanding && (
            <button className="dashboard-nav-item" onClick={onBackToLanding} style={{ color: 'var(--ivory-dim)', marginBottom: 12, borderRadius: 12 }}>
              <Globe size={18} /> Site Web (Accueil)
            </button>
          )}
          <div className="dashboard-sidebar-title" style={{ fontSize: 11, letterSpacing: 1.2, color: 'var(--coral)', marginBottom: 14, fontWeight: 700 }}>EXPLOITATION</div>
          <button className={`dashboard-nav-item ${currentView === 'overview' ? 'active' : ''}`} onClick={() => setCurrentView('overview')} style={{ borderRadius: 12, marginBottom: 6 }}>
            <TrendingUp size={18} /> Vue d'ensemble
          </button>
          <button className={`dashboard-nav-item ${currentView === 'users' ? 'active' : ''}`} onClick={() => setCurrentView('users')} style={{ borderRadius: 12, marginBottom: 6 }}>
            <Users size={18} /> Utilisateurs ({filteredUsers.length})
          </button>
          <button className={`dashboard-nav-item ${currentView === 'songs' ? 'active' : ''}`} onClick={() => setCurrentView('songs')} style={{ borderRadius: 12, marginBottom: 6 }}>
            <Music size={18} /> Chansons ({allSongs.length})
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,107,91,0.2)', borderRadius: 16, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--coral), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: 16, boxShadow: '0 4px 12px rgba(255,107,91,0.3)' }}>
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ivory)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || 'Administrateur'}</div>
              <div style={{ fontSize: 11, color: 'var(--gold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
            </div>
          </div>
          <button className="dashboard-nav-item" style={{ color: 'var(--coral)', width: '100%', borderRadius: 12, border: '1px solid rgba(255,107,91,0.15)', justifyContent: 'center' }} onClick={onLogout}>
            <LogOut size={18} /> Déconnexion Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ gridColumn: '2 / span 2', padding: '36px 32px 80px', height: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <div className="admin-header-bar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, fontFamily: 'Fraunces, serif', color: 'var(--ivory)' }}>
                Console d'Administration
              </h1>
              <span className="admin-badge success">
                ● Système en Ligne (Kie.ai)
              </span>
            </div>
            <p style={{ color: 'var(--ivory-dim)', fontSize: 14, margin: 0 }}>
              Gérez les transactions, les utilisateurs, le catalogue de morceaux et les codes promotionnels Technova.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="admin-search-box">
              <Search size={16} style={{ color: 'var(--ivory-dim)' }} />
              <input
                type="text"
                placeholder="Rechercher utilisateur, titre, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <X size={14} style={{ cursor: 'pointer', color: 'var(--coral)' }} onClick={() => setSearchQuery('')} />
              )}
            </div>

            <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 13, color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} /> 10 Août 2026
            </div>
          </div>
        </div>

        {/* OVERVIEW VIEW */}
        {currentView === 'overview' && (
          <>
            {/* KPI Metrics Cards */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span className="admin-kpi-title">Revenu Total FCFA</span>
                  <div className="admin-kpi-icon"><DollarSign size={22} /></div>
                </div>
                <div className="admin-kpi-value">{stats.totalRevenueFcfa.toLocaleString()} FCFA</div>
                <div className="admin-kpi-trend">
                  <TrendingUp size={14} /> +18.4% ce mois-ci
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span className="admin-kpi-title">Utilisateurs Actifs</span>
                  <div className="admin-kpi-icon" style={{ background: 'rgba(244,209,122,0.12)', color: 'var(--gold)', borderColor: 'rgba(244,209,122,0.25)' }}>
                    <Users size={22} />
                  </div>
                </div>
                <div className="admin-kpi-value">{stats.activeUsersToday} <span style={{ fontSize: 14, color: 'var(--ivory-dim)', fontWeight: 500 }}>/ {stats.totalUsers}</span></div>
                <div className="admin-kpi-trend" style={{ color: 'var(--gold)' }}>
                  <Activity size={14} /> +12% cette semaine
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span className="admin-kpi-title">Chansons Générées</span>
                  <div className="admin-kpi-icon" style={{ background: 'rgba(47,217,196,0.12)', color: 'var(--teal)', borderColor: 'rgba(47,217,196,0.25)' }}>
                    <Music size={22} />
                  </div>
                </div>
                <div className="admin-kpi-value">{stats.totalSongsGenerated.toLocaleString()}</div>
                <div className="admin-kpi-trend" style={{ color: 'var(--teal)' }}>
                  <Music size={14} /> +24 aujourd'hui
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-header">
                  <span className="admin-kpi-title">Téléchargements MP3</span>
                  <div className="admin-kpi-icon" style={{ background: 'rgba(162,155,254,0.12)', color: '#a29bfe', borderColor: 'rgba(162,155,254,0.25)' }}>
                    <Download size={22} />
                  </div>
                </div>
                <div className="admin-kpi-value">{stats.totalDownloads.toLocaleString()}</div>
                <div className="admin-kpi-trend" style={{ color: '#a29bfe' }}>
                  <Check size={14} /> 92% Taux de satisfaction
                </div>
              </div>
            </div>

            {/* Distribution Charts & Overview Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 36 }}>
              <div className="admin-table-card" style={{ marginBottom: 0 }}>
                <div className="admin-table-header">
                  <div className="admin-table-title">
                    <CreditCard size={20} className="text-coral" /> Transactions Récentes (Moneroo & MoMo)
                  </div>
                  <span className="admin-badge neutral">Dernières 24 Heures</span>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Référence</th>
                        <th>Canal de Paiement</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Date & Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPayments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ivory)' }}>{p.reference}</td>
                          <td>
                            <span className={`provider-chip ${getProviderClass(p.provider)}`}>
                              {p.provider}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800, color: 'var(--coral)' }}>{p.amountFcfa.toLocaleString()} FCFA</td>
                          <td>
                            <span className="admin-badge success">
                              <Check size={12} /> Réussi
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{p.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="admin-table-card" style={{ marginBottom: 0 }}>
                <div className="admin-table-header">
                  <div className="admin-table-title" style={{ fontSize: 16 }}>
                    <PieChart size={18} className="text-gold" /> Répartition Canaux
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span className="provider-chip momo">MTN Mobile Money</span>
                      <span style={{ fontWeight: 700, color: '#ffcc00' }}>48%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '48%', background: '#ffcc00' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span className="provider-chip wave">Wave Senegal/CI</span>
                      <span style={{ fontWeight: 700, color: '#00b8d4' }}>32%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '32%', background: '#00b8d4' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span className="provider-chip orange">Orange Money</span>
                      <span style={{ fontWeight: 700, color: '#ff6600' }}>15%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '15%', background: '#ff6600' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span className="provider-chip card">Carte Bancaire / VISA</span>
                      <span style={{ fontWeight: 700, color: '#ba68c8' }}>5%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '5%', background: '#ba68c8' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Created Songs Table in Overview */}
            <div className="admin-table-card">
              <div className="admin-table-header">
                <div>
                  <div className="admin-table-title">
                    <Music size={20} className="text-teal" /> Derniers Sons Créés & Détails du Tarif
                  </div>
                  <p style={{ color: 'var(--ivory-dim)', fontSize: 13, margin: '4px 0 0' }}>
                    Aperçu des chansons générées récemment, de l'utilisateur qui les a créées et du tarif appliqué.
                  </p>
                </div>
                <button 
                  className="btn-glass" 
                  style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8 }}
                  onClick={() => setCurrentView('songs')}
                >
                  Voir tout le catalogue ({allSongs.length}) →
                </button>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Titre du Morceau</th>
                      <th>Créateur / Utilisateur</th>
                      <th>Genre & Style</th>
                      <th>Occasion</th>
                      <th>Prix du Morceau</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Audio MP3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSongs.slice(0, 5).map((s) => {
                      const creator = MOCK_USERS.find(u => u.id === s.userId) || {
                        fullName: 'Adjoa Mensah',
                        email: 'adjoa@example.com'
                      };
                      const price = s.priceFcfa || 2500;
                      return (
                        <tr key={s.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{s.title || `Chanson pour ${s.recipientName}`}</div>
                            <div style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>Pour: {s.recipientName}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--ivory)', fontSize: 13 }}>{creator.fullName}</div>
                            <div style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{creator.email}</div>
                          </td>
                          <td>
                            <span className="admin-badge warning">{s.genre}</span>
                          </td>
                          <td>
                            <span className="admin-badge neutral">{s.occasion}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: 14 }}>
                              {price.toLocaleString()} FCFA
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{s.createdAt}</td>
                          <td style={{ textAlign: 'right' }}>
                            {s.audioUrl ? (
                              <a 
                                href={s.audioUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-emerald"
                                style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                              >
                                <Download size={13} /> Écouter MP3
                              </a>
                            ) : (
                              <span className="admin-badge neutral">Généré</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* USERS MANAGEMENT VIEW */}
        {currentView === 'users' && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div>
                <div className="admin-table-title">
                  <Users size={22} className="text-coral" /> Gestion des Utilisateurs ({filteredUsers.length})
                </div>
                <p style={{ color: 'var(--ivory-dim)', fontSize: 13, margin: '4px 0 0' }}>
                  Consultez les détails des comptes, suspendez les profils douteux ou créditez des bonus.
                </p>
              </div>

              <button className="btn-coral" style={{ fontSize: 13, padding: '10px 18px' }}>
                <Plus size={16} /> Ajouter Utilisateur
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Téléphone & Pays</th>
                    <th>Rôle</th>
                    <th>Inscrit le</th>
                    <th>Chansons</th>
                    <th>Statut</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div 
                            style={{ 
                              width: 36, height: 36, borderRadius: '50%', 
                              background: 'linear-gradient(135deg, var(--coral), var(--gold))', 
                              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              fontWeight: 800, fontSize: 14, boxShadow: '0 4px 12px rgba(255,107,91,0.25)' 
                            }}
                          >
                            {u.fullName.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 700, color: '#fff' }}>{u.fullName}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--ivory-dim)' }}>{u.email}</td>
                      <td style={{ fontSize: 12.5 }}>{u.phone || 'N/A'} ({u.country})</td>
                      <td>
                        <span className="admin-badge neutral">
                          {u.role === 'admin' ? 'Super Admin' : 'Client'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{u.createdAt}</td>
                      <td style={{ fontWeight: 800, color: 'var(--gold)' }}>{u.totalSongs} morceaux</td>
                      <td>
                        <span className={`admin-badge ${u.status === 'active' ? 'success' : 'danger'}`}>
                          {u.status === 'active' ? '● Actif' : '✖ Banni'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn-glass" 
                          style={{ padding: '6px 14px', fontSize: 12, borderRadius: 8 }}
                          onClick={() => setSelectedUser(u)}
                        >
                          <Eye size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SONGS CATALOG VIEW */}
        {currentView === 'songs' && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div>
                <div className="admin-table-title">
                  <Music size={22} className="text-teal" /> Catalogue Global des Chansons ({filteredSongs.length})
                </div>
                <p style={{ color: 'var(--ivory-dim)', fontSize: 13, margin: '4px 0 0' }}>
                  Aperçu de l'ensemble des titres générés sur la plateforme par l'IA Sonorya.
                </p>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre du Morceau</th>
                    <th>Créateur / Auteur</th>
                    <th>Genre & Style</th>
                    <th>Occasion</th>
                    <th>Prix Payé</th>
                    <th>Durée</th>
                    <th>Date de Création</th>
                    <th style={{ textAlign: 'right' }}>Audio MP3</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((s) => {
                    const creator = MOCK_USERS.find(u => u.id === s.userId) || {
                      fullName: 'Adjoa Mensah',
                      email: 'adjoa@example.com'
                    };
                    const price = s.priceFcfa || 2500;
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{s.title || `Chanson pour ${s.recipientName}`}</div>
                          <div style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>Pour: {s.recipientName}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--ivory)', fontSize: 13 }}>{creator.fullName}</div>
                          <div style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{creator.email}</div>
                        </td>
                        <td>
                          <span className="admin-badge warning">{s.genre}</span>
                        </td>
                        <td>
                          <span className="admin-badge neutral">{s.occasion}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: 14 }}>
                            {price.toLocaleString()} FCFA
                          </span>
                        </td>
                        <td style={{ fontSize: 12, fontFamily: 'monospace' }}>
                          {s.durationSeconds ? `${Math.floor(s.durationSeconds / 60)}:${(s.durationSeconds % 60).toString().padStart(2, '0')}` : '3:15'}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{s.createdAt}</td>
                        <td style={{ textAlign: 'right' }}>
                          {s.audioUrl ? (
                            <a 
                              href={s.audioUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn-emerald"
                              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                            >
                              <Download size={13} /> Écouter MP3
                            </a>
                          ) : (
                            <span className="admin-badge neutral">Généré</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROMO CODES VIEW */}
        {currentView === 'promos' && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div>
                <div className="admin-table-title">
                  <Tag size={22} className="text-gold" /> Gestionnaire de Codes Promo & Réductions
                </div>
                <p style={{ color: 'var(--ivory-dim)', fontSize: 13, margin: '4px 0 0' }}>
                  Créez et contrôlez les codes de réduction offerts à vos partenaires ou lors de promotions.
                </p>
              </div>
            </div>

            {/* Promo Creator Form */}
            <form onSubmit={handleAddPromoCode} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 28, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: 14, alignItems: 'end' }}>
              <div>
                <label className="form-label" style={{ fontSize: 11 }}>Code Promo</label>
                <input
                  type="text"
                  placeholder="ex: SONORYA50"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  style={{ textTransform: 'uppercase', fontWeight: 700 }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11 }}>Réduction (%)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11 }}>Utilisations Max</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(Number(e.target.value))}
                  required
                />
              </div>

              <button type="submit" className="btn-emerald" style={{ padding: '14px', borderRadius: 12 }}>
                <Plus size={16} /> Générer le Code
              </button>
            </form>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code Promo</th>
                    <th>Pourcentage Réduction</th>
                    <th>Utilisations</th>
                    <th>Date d'Expiration</th>
                    <th>Statut</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((pc) => {
                    const usagePercent = Math.round((pc.currentUses / pc.maxUses) * 100);
                    return (
                      <tr key={pc.id}>
                        <td style={{ fontWeight: 800, color: 'var(--gold)', fontSize: 15, fontFamily: 'monospace' }}>{pc.code}</td>
                        <td style={{ fontWeight: 700, color: 'var(--coral)' }}>-{pc.discountPercent}% OFF</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, width: 60 }}>{pc.currentUses} / {pc.maxUses}</span>
                            <div style={{ flex: 1, maxWidth: 100, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${usagePercent}%`, background: 'var(--gold)' }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 12.5, color: 'var(--ivory-dim)' }}>{pc.expiresAt}</td>
                        <td>
                          <span className={`admin-badge ${pc.isActive ? 'success' : 'danger'}`}>
                            {pc.isActive ? '● Actif' : '✖ Expiré'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="btn-glass" 
                            style={{ padding: '4px 12px', fontSize: 11, borderRadius: 6 }}
                            onClick={() => {
                              setPromoCodes(promoCodes.map(p => p.id === pc.id ? { ...p, isActive: !p.isActive } : p));
                            }}
                          >
                            {pc.isActive ? 'Désactiver' : 'Réactiver'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected User Detail Modal */}
        {selectedUser && (
          <AdminUserModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
            t={t} 
            recentPayments={stats.recentPayments} 
          />
        )}

        {/* Footer info */}
        <div style={{ textAlign: 'center', padding: '24px 0 10px', marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          © {new Date().getFullYear()} Sonorya AI Platform · Technova Admin Suite. Tous droits réservés.
        </div>
      </main>
    </div>
  );
};
