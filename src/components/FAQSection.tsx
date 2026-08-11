import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Send } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Puis-je inclure un prénom, une anecdote ou un message personnel ?',
    answer:
      'Oui, c\'est tout l\'intérêt de Sonorya. Donnez un ou plusieurs prénoms (ex. "Joyeux anniversaire Adjoa et Kofi"), une anecdote précise ou vos vœux, et Sonorya les intègre harmonieusement dans la structure des couplets et du refrain.'
  },
  {
    question: 'Pour quelles occasions puis-je créer une chanson ?',
    answer:
      'Absolument toutes : Anniversaires, Mariages, Demandes en mariage, Baptêmes, Cérémonies de Dot, Réussites scolaires ou professionnelles (BAC, Diplômes), Hommages, Encouragements, Remerciements, Excuses, ou simplement pour le plaisir d\'offrir.'
  },
  {
    question: 'Combien de temps faut-il pour recevoir la chanson finale HD ?',
    answer:
      'Entre 1 et 3 minutes seulement après la confirmation de votre règlement. Vous recevez directement votre lien d\'écoute privée ainsi qu\'un lien de téléchargement direct du fichier au format MP3 Haute Définition.'
  },
  {
    question: 'Comment s\'effectue le paiement ?',
    answer:
      'Le paiement est 100% sécurisé via la passerelle de paiement. Vous pouvez régler par Mobile Money (Orange Money, Wave, MTN MoMo, Moov Money) ou par Carte Bancaire directement depuis votre smartphone sans complication.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [userQuestion, setUserQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setUserQuestion('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="wrap" id="faq">
      <h2>Questions fréquentes</h2>
      <div className="section-sub">
        Tout ce que vous devez savoir pour créer et recevoir votre chanson personnalisée.
      </div>

      <div className="faq-grid">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="faq-item">
              <div className="faq-header" onClick={() => toggleAccordion(idx)}>
                <span>{faq.question}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: 'var(--gold)'
                  }}
                />
              </div>

              {isOpen && <div className="faq-body">{faq.answer}</div>}
            </div>
          );
        })}
      </div>

      {/* Ask question form */}
      <div style={{ marginTop: 32, background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 24 }}>
        <h4 style={{ fontSize: 16, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <HelpCircle size={18} className="text-teal" /> Une autre question ?
        </h4>
        <p style={{ fontSize: 13.5, color: 'var(--ivory-dim)', marginBottom: 14 }}>
          Notre équipe support basée à Cotonou & Paris vous répond en moins de 15 minutes.
        </p>

        {submitted ? (
          <div style={{ color: 'var(--teal)', fontSize: 13.5, fontWeight: 600 }}>
            ✓ Votre question a bien été envoyée à l'équipe Mélodia !
          </div>
        ) : (
          <form onSubmit={handleQuestionSubmit} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              placeholder="Posez votre question ici..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="cta" style={{ width: 'auto', marginTop: 0, padding: '0 20px' }}>
              <Send size={16} /> Envoyer
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
