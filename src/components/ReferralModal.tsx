import React, { useState } from 'react';
import { X, Gift, Copy, Check, Share2, Sparkles } from 'lucide-react';

interface ReferralModalProps {
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'SONORYA-TECH2026';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎁 Offre spéciale Mélodia by Technova ! Utilise mon lien pour créer une chanson sur-mesure (Mariage, Dot, BAC, Anniversaire) et reçois 500 FCFA de réduction :\n\n${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(212,161,57,0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Gift size={28} />
          </div>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: 24, marginBottom: 6 }}>
            Programme de Parrainage
          </h3>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            Offrez 500 FCFA de réduction à vos amis et gagnez <strong>1 Chanson Gratuite</strong> tous les 3 parrainages validés !
          </p>
        </div>

        {/* Code Box */}
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--gold)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            VOTRE CODE PARRAIN EXCLUSIF
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)', letterSpacing: 2, fontFamily: 'monospace' }}>
            {referralCode}
          </div>
        </div>

        {/* Link Share Row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button className="cta" style={{ marginTop: 0, flex: 1 }} onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Lien Copié !' : 'Copier le Lien'}
          </button>

          <button
            style={{
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '0 18px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onClick={handleShareWhatsApp}
          >
            <Share2 size={16} /> WhatsApp
          </button>
        </div>

        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 14, padding: 14, fontSize: 12.5, color: 'var(--ivory-dim)' }}>
          💡 Les crédits gagnés sont automatiquement appliqués lors de votre prochaine commande sur Mélodia.
        </div>
      </div>
    </div>
  );
};
