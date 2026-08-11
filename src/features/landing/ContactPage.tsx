import React, { useState } from 'react';
import { Mail, Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { useToast } from '../../components/ToastProvider';
import { useTranslation } from '../../i18n/LanguageContext';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(t('contact.successToast'), 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '120px 24px 80px', minHeight: '80vh' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontSize: 16, fontWeight: 600 }}>
        <ArrowLeft size={20} /> {t('contact.backToHome')}
      </button>

      <div style={{ textAlign: 'center', marginBottom: 54 }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, fontFamily: 'Fraunces, serif', marginBottom: 16, color: 'var(--ivory)' }}>
          {t('contact.titleStart')} <span className="accent">{t('contact.titleHighlight')}</span>
        </h1>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
          {t('contact.subtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,161,57,0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Mail size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#fff' }}>Email Support</h3>
          <p style={{ color: 'var(--ivory-dim)', marginBottom: 14, fontSize: 14 }}>{t('contact.emailDesc')}</p>
          <a href="mailto:support@technovalearning.com" style={{ color: 'var(--coral)', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
            support@technovalearning.com
          </a>
        </div>

        <div style={{ background: 'rgba(37, 211, 102, 0.04)', border: '1px solid rgba(37, 211, 102, 0.25)', borderRadius: 24, padding: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,211,102,0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <MessageCircle size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#fff' }}>WhatsApp Support</h3>
          <p style={{ color: 'var(--ivory-dim)', marginBottom: 18, fontSize: 14 }}>Discutez en direct avec notre équipe d'assistance via WhatsApp.</p>
          <a
            href="https://wa.me/2290147883735"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-emerald"
            style={{ background: '#25D366', borderColor: '#25D366', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '10px 20px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}
          >
            <MessageCircle size={18} /> Discuter sur WhatsApp
          </a>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, color: 'var(--ivory-dim)', marginBottom: 8 }}>{t('contact.formName')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 12, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, color: 'var(--ivory-dim)', marginBottom: 8 }}>{t('contact.formEmail')}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 12, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, color: 'var(--ivory-dim)', marginBottom: 8 }}>{t('contact.formSubject')}</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 12, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, color: 'var(--ivory-dim)', marginBottom: 8 }}>{t('contact.formMessage')}</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 12, outline: 'none', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn-coral" style={{ marginTop: 8, padding: '16px', fontSize: 16 }} disabled={isSubmitting}>
              {isSubmitting ? t('contact.sending') : <><Send size={18} /> {t('contact.sendButton')}</>}
            </button>
          </form>
      </div>
    </div>
  );
};
