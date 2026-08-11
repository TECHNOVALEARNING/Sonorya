import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Send } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [qText, setQText] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    { q: 'Puis-je inclure des prénoms et des histoires précises ?', a: 'Oui ! Notre IA intègre vos prénoms, souvenirs et anecdotes dans les couplets et le refrain.' },
    { q: 'Combien de temps faut-il pour recevoir le morceau MP3 HD ?', a: 'Entre 1 et 3 minutes seulement après la confirmation de votre paiement sur Moneroo Checkout.' },
    { q: 'Quels moyens de paiement sont supportés ?', a: 'Tous les canaux Mobile Money majeurs (MTN MoMo, Orange Money, Moov Money, Wave) ainsi que les cartes bancaires.' },
    { q: 'Puis-je télécharger et partager la chanson sur WhatsApp ?', a: 'Oui, vous disposez d\'un lien de téléchargement MP3 direct et d\'un bouton de partage WhatsApp immédiat.' }
  ];

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Foire aux Questions & Support</h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
        Toutes les réponses pour réussir votre création musicale avec Mélodia AI.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {faqs.map((f, i) => (
          <div key={i} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{ padding: 18, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span>{f.q}</span>
              <ChevronDown size={18} style={{ transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: 'var(--coral)' }} />
            </div>
            {openIdx === i && (
              <div style={{ padding: '0 18px 18px', fontSize: 13.5, color: 'var(--ivory-dim)', borderTop: '1px solid var(--glass-border)', paddingTop: 12 }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card">
        <h4 style={{ fontSize: 16, marginBottom: 6 }}>Une autre question à poser ?</h4>
        <p style={{ fontSize: 13, color: 'var(--ivory-dim)', marginBottom: 14 }}>Notre support vous répond sous 15 minutes.</p>
        {sent ? (
          <div style={{ color: 'var(--coral)', fontSize: 13, fontWeight: 600 }}>✓ Question bien transmise à l'équipe !</div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="text" placeholder="Votre question..." value={qText} onChange={(e) => setQText(e.target.value)} style={{ flex: 1 }} />
            <button className="btn-emerald" onClick={() => { if (qText.trim()) setSent(true); }}>
              <Send size={16} /> Envoyer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
