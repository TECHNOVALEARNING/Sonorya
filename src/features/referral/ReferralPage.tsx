import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Award, Users } from 'lucide-react';
import { UserProfile } from '../../types/melodia';

interface ReferralPageProps {
  user: UserProfile | null;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const code = user?.referralCode || 'SONORYA-TECH2026';
  const link = `${window.location.origin}/?ref=${code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Programme de Parrainage & Récompenses</h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
        Partagez votre code unique et gagnez 1 Chanson Gratuite tous les 3 amis parrainés !
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,107,91,0.15)', color: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Gift size={24} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>VOTRE CODE PARRAIN</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--coral)', letterSpacing: 2, margin: '6px 0 14px' }}>
            {code}
          </div>
          <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Lien copié !' : 'Copier mon lien'}
          </button>
        </div>

        <div className="glass-card">
          <h4 style={{ fontSize: 16, marginBottom: 12 }}>Vos Statistiques de Gain</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--ivory-dim)' }}>Filleuls inscrits</span>
            <span style={{ fontWeight: 700, color: 'var(--coral)' }}>4 amis</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--ivory-dim)' }}>Gains cumulés</span>
            <span style={{ fontWeight: 700, color: 'var(--coral)' }}>2 000 FCFA</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ color: 'var(--ivory-dim)' }}>Chansons offertes</span>
            <span style={{ fontWeight: 700, color: 'var(--coral)' }}>1 chanson gratuite disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};
