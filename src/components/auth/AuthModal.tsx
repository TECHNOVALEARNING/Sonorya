import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { authRepository } from '../../repositories/authRepository';
import { UserProfile } from '../../types/melodia';
import { useTranslation } from '../../i18n/LanguageContext';
import { useToast } from '../ToastProvider';
import { triggerGoogleSignIn } from '../../services/googleAuthService';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, initialMode = 'login' }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot') {
      showToast(`${t('auth.resetAlert')} ${email}`, 'success');
      setMode('login');
      return;
    }

    if (mode === 'login') {
      const result = await authRepository.loginWithEmail(email, password);
      if (result.error === 'invalid_password') {
        setError(t('auth.errorInvalidPassword'));
        return;
      }
      if (result.user) {
        showToast('Connexion réussie !', 'success');
        onSuccess(result.user);
      }
    }

    if (mode === 'signup') {
      const result = await authRepository.signupWithEmail(email, password, fullName);
      if (result.error === 'email_taken') {
        setError(t('auth.errorEmailTaken'));
        return;
      }
      if (result.user) {
        showToast('Compte créé avec succès !', 'success');
        onSuccess(result.user);
      }
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSocial = async (provider: 'google' | 'apple') => {
    setIsGoogleLoading(true);
    triggerGoogleSignIn(
      () => {
        // Redirection en cours...
      },
      (errMessage) => {
        setIsGoogleLoading(false);
        showToast(errMessage, 'error');
      }
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 24, marginBottom: 6 }}>
            {mode === 'login' && t('auth.loginTitle')}
            {mode === 'signup' && t('auth.signupTitle')}
            {mode === 'forgot' && t('auth.forgotTitle')}
          </h3>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 13.5, marginBottom: 12 }}>
            {mode === 'login' && t('auth.loginSubtitle')}
            {mode === 'signup' && t('auth.signupSubtitle')}
            {mode === 'forgot' && t('auth.forgotSubtitle')}
          </p>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '12.5px', color: '#ccc', lineHeight: '1.4' }}>
            <strong>Objectif de l'application :</strong> Sonorya est un générateur de chansons personnalisées. Créez un compte pour générer, sauvegarder, payer et télécharger vos musiques de manière sécurisée.
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ 
            background: 'rgba(255,107,91,0.15)', 
            border: '1px solid rgba(255,107,91,0.4)', 
            borderRadius: 10, 
            padding: '10px 14px', 
            marginBottom: 16, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10, 
            fontSize: 13, 
            color: 'var(--coral)' 
          }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Social Logins */}
        {mode !== 'forgot' && (
          <div style={{ marginBottom: 20 }}>
            <button 
              type="button"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '12px 18px', 
                borderRadius: 12, 
                background: 'rgba(255,255,255,0.06)', 
                border: '1px solid rgba(255,255,255,0.15)', 
                color: '#FFFFFF', 
                fontWeight: 600, 
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }} 
              onClick={() => handleSocial('google')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {t('auth.continueGoogle')}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">{t('auth.fullName')}</label>
              <input
                type="text"
                placeholder={t('auth.fullNamePlaceholder')}
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label className="form-label">{t('auth.email')}</label>
            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">{t('auth.password')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-coral" style={{ width: '100%', justifyContent: 'center' }}>
            {mode === 'login' && t('auth.loginBtn')}
            {mode === 'signup' && t('auth.signupBtn')}
            {mode === 'forgot' && t('auth.forgotBtn')}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--coral)', marginTop: 18 }}>
          {mode === 'login' ? (
            <>
              <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => { setMode('forgot'); setError(''); }}>
                {t('auth.forgotLink')}
              </button>
              <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => { setMode('signup'); setError(''); }}>
                {t('auth.noAccountLink')}
              </button>
            </>
          ) : (
            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', margin: '0 auto' }} onClick={() => { setMode('login'); setError(''); }}>
              {t('auth.hasAccountLink')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

