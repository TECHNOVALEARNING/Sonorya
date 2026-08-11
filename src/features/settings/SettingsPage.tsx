import React, { useState } from 'react';
import { User, Bell, Globe, Moon, Sun, Trash2, LogOut, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types/melodia';

interface SettingsPageProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onLogout }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState('Français');

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Paramètres du Compte</h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
        Gérez vos informations personnelles, notifications et préférences de thème.
      </p>

      {/* Profile Card */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 16, marginBottom: 14 }}>Profil Utilisateur</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <img src={user?.avatarUrl} alt="Avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.fullName}</div>
            <div style={{ fontSize: 13, color: 'var(--ivory-dim)' }}>{user?.email}</div>
            <div style={{ fontSize: 12, color: 'var(--coral)', marginTop: 2 }}>{user?.phone} · {user?.country}</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 16, marginBottom: 14 }}>Préférences & Apparence</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Thème visuel</div>
            <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>Émeraude Dark / Light</div>
          </div>
          <button className="btn-glass" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Thème Sombre' : 'Thème Clair'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Langue de l'application</div>
            <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>Français / English</div>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: 140 }}>
            <option value="Français">Français</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="glass-card">
        <h4 style={{ fontSize: 16, marginBottom: 14, color: '#F43F5E' }}>Zone de Sécurité</h4>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-glass" style={{ color: '#F43F5E' }} onClick={onLogout}>
            <LogOut size={16} /> Se Déconnecter
          </button>
          <button className="btn-glass" style={{ color: '#F43F5E' }} onClick={() => alert('Demande de suppression de compte initiée.')}>
            <Trash2 size={16} /> Supprimer mon Compte
          </button>
        </div>
      </div>
    </div>
  );
};
