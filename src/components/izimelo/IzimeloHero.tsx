import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface IzimeloHeroProps {
  onOpenCreate: () => void;
}

const heroStyles = `
  :root {
    --bg-deep: #1b1d27;
    --bg-mid: #222533;
    --bg-plum: #2b2e3e;
    --coral-accent: #2dd4bf;
    --coral-soft: #5eead4;
    --gold-1: #2dd4bf;
    --gold-2: #0ea5e9;
    --cream: #ffffff;
    --lavender: #94a3b8;
    --lavender-dim: #64748b;
    --ease-apple: cubic-bezier(0.22, 1, 0.36, 1);
  }

  .melodia-hero-section {
    position: relative;
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    background: var(--bg-deep);
    font-family: 'Manrope', sans-serif;
    color: var(--cream);
    overflow: hidden;
  }

  /* Ambient background */
  .bg-glow {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(circle at 75% 30%, rgba(45,212,191,0.16), transparent 45%),
      radial-gradient(circle at 18% 70%, rgba(14,165,233,0.12), transparent 50%),
      radial-gradient(ellipse at 50% 0%, var(--bg-plum), var(--bg-mid) 50%, var(--bg-deep) 85%);
  }

  .grain {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .hero {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    align-items: center;
    gap: 24px;
  }

  /* ---------- LEFT: TEXT ---------- */
  .copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold-1);
    font-weight: 500;
    margin-bottom: 22px;
    opacity: 0;
    animation: riseIn 0.9s var(--ease-apple) forwards;
    animation-delay: 0.1s;
  }
  .eyebrow::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold-1);
    box-shadow: 0 0 12px 2px rgba(244,209,122,0.7);
  }

  .headline {
    font-family: 'Fraunces', serif;
    font-weight: 500;
    line-height: 1.06;
    font-size: clamp(2.6rem, 5.4vw, 4.6rem);
    color: var(--cream);
  }

  .headline .line {
    display: block;
    overflow: hidden;
  }

  .headline .line span {
    display: inline-block;
    opacity: 0;
    transform: translateY(115%);
    background: linear-gradient(100deg,
      var(--cream) 0%, var(--gold-1) 22%, var(--coral-accent) 42%,
      var(--lavender) 58%, var(--gold-1) 76%, var(--cream) 100%);
    background-size: 320% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation-name: riseIn, shimmer;
    animation-duration: 0.95s, 7s;
    animation-timing-function: var(--ease-apple), ease-in-out;
    animation-fill-mode: forwards, none;
    animation-iteration-count: 1, infinite;
  }

  .headline .line:nth-child(1) span { animation-delay: 0.28s, 1.1s; }
  .headline .line:nth-child(2) span { animation-delay: 0.42s, 1.35s; }

  .headline .accent {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    background: linear-gradient(100deg,
      var(--coral-accent) 0%, var(--gold-1) 30%, var(--coral-soft) 55%,
      var(--gold-1) 80%, var(--coral-accent) 100%);
    background-size: 280% 100%;
    animation-duration: 0.95s, 4.5s;
    animation-delay: 0.42s, 1.6s;
  }

  @keyframes riseIn {
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .subtext {
    margin-top: 26px;
    max-width: 460px;
    font-size: 16.5px;
    line-height: 1.65;
    color: var(--lavender);
    font-weight: 300;
    opacity: 0;
    animation: riseIn 0.9s var(--ease-apple) forwards;
    animation-delay: 0.62s;
  }

  .cta-row {
    margin-top: 38px;
    opacity: 0;
    animation: riseIn 0.9s var(--ease-apple) forwards;
    animation-delay: 0.78s;
  }

  .cta {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 34px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 15px;
    color: #0F172A;
    background: linear-gradient(135deg, #2DD4BF, #0EA5E9);
    box-shadow: 0 10px 30px -8px rgba(45, 212, 191, 0.55);
    transition: transform 0.45s var(--ease-apple), box-shadow 0.45s var(--ease-apple);
  }
  .cta:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 16px 38px -6px rgba(45, 212, 191, 0.75);
  }
  .cta:active { transform: translateY(-1px) scale(0.99); }

  .cta svg { width: 16px; height: 16px; transition: transform 0.4s var(--ease-apple); }
  .cta:hover svg { transform: translateX(3px); }

  .proof {
    margin-top: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    animation: riseIn 0.9s var(--ease-apple) forwards;
    animation-delay: 0.92s;
  }

  .avatars { display: flex; }
  .avatars span {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: 2px solid var(--bg-deep);
    margin-left: -10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: #fff;
  }
  .avatars span:first-child { margin-left: 0; }
  .avatars span:nth-child(1) { background: linear-gradient(135deg, #6c5ce7, #a29bfe); }
  .avatars span:nth-child(2) { background: linear-gradient(135deg, #e17055, #fab1a0); }
  .avatars span:nth-child(3) { background: linear-gradient(135deg, #00b894, #55efc4); }

  .proof-text { font-size: 13px; color: var(--lavender-dim); }
  .stars { color: var(--gold-1); letter-spacing: 1px; font-size: 13px; }
  .proof-text strong { color: var(--cream); font-weight: 600; }

  /* ---------- RIGHT: ANIMATED LISTENER ---------- */
  .stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 540px;
    opacity: 0;
    animation: fadeScaleIn 1.1s var(--ease-apple) forwards;
    animation-delay: 0.35s;
  }

  @keyframes fadeScaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }

  .blob {
    position: absolute;
    width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, rgba(45, 212, 191, 0.14), rgba(14, 165, 233, 0.07) 55%, transparent 75%);
    filter: blur(52px);
    animation: breathe 6s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.08); opacity: 0.7; }
  }

  /* ---- duo character illustration ---- */
  .duo {
    position: relative;
    width: 440px;
    height: 440px;
    animation: bob 4.6s var(--ease-apple) infinite;
    transform-origin: 50% 82%;
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(-0.8deg); }
  }

  .duo-svg { width: 100%; height: 100%; display: block; overflow: visible; }

  .figure-man {
    filter: brightness(0.88) saturate(0.92);
    animation: bobMan 5.4s var(--ease-apple) infinite;
    transform-origin: 300px 330px;
  }
  .figure-woman {
    filter: drop-shadow(0 14px 22px rgba(11,7,20,0.45));
    animation: bobWoman 4.6s var(--ease-apple) infinite;
    transform-origin: 128px 340px;
  }
  @keyframes bobMan {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-4px) rotate(0.6deg); }
  }
  @keyframes bobWoman {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-7px) rotate(-1deg); }
  }

  /* pulse rings from the front ear cup */
  .ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid rgba(45,212,191,0.55);
    top: 55%;
    left: 64%;
    width: 44px;
    height: 44px;
    transform: translate(-50%,-50%) scale(1);
    opacity: 0;
    animation: pulse 2.6s var(--ease-apple) infinite;
  }
  .ring:nth-child(2) { animation-delay: 0.65s; border-color: rgba(94,234,212,0.5); }
  .ring:nth-child(3) { animation-delay: 1.3s; border-color: rgba(14,165,233,0.4); }

  @keyframes pulse {
    0% { opacity: 0.75; transform: translate(-50%,-50%) scale(0.6); }
    70% { opacity: 0; transform: translate(-50%,-50%) scale(2.6); }
    100% { opacity: 0; transform: translate(-50%,-50%) scale(2.6); }
  }

  /* ---- minimalist solfège symbols orbiting the duo ---- */
  .orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    animation: spin 28s linear infinite;
  }
  .note-pos {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }
  .note {
    position: absolute;
    display: inline-block;
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    line-height: 1;
    color: var(--gold-1);
    transform: translate(-50%,-50%);
    animation: counterspin 28s linear infinite;
    opacity: 0.85;
  }
  .note.n2, .note.n5 { color: var(--coral-soft); }
  .note.n3, .note.n6 { color: var(--lavender); font-size: 19px; }
  .note.n1 { font-size: 20px; }
  .note.n4 { font-size: 17px; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes counterspin {
    to { transform: translate(-50%,-50%) rotate(-360deg); }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 880px) {
    .hero { grid-template-columns: 1fr; text-align: center; }
    .copy { align-items: center; text-align: center; order: 2; }
    .subtext { max-width: 100%; }
    .stage { order: 1; height: 320px; }
    .duo { width: 230px; height: 230px; }
    .orbit { transform: scale(0.75); }
    .proof { justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

export const IzimeloHero: React.FC<IzimeloHeroProps> = ({ onOpenCreate }) => {
  const { t } = useTranslation();

  return (
    <section className="melodia-hero-section">
      <style>{heroStyles}</style>

      <div className="bg-glow"></div>
      <div className="grain"></div>

      <div className="hero">
        {/* LEFT: COPY */}
        <div className="copy">
          <h1 className="headline">
            <span className="line"><span>{t('hero.titleStart')}</span></span>
            <span className="line"><span className="accent">{t('hero.titleHighlight')}</span></span>
          </h1>

          <p className="subtext">
            {t('hero.subtitle')}
          </p>

          <div className="cta-row">
            <button className="btn-coral" onClick={onOpenCreate}>
              {t('hero.createCta')}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="proof">
            <div className="avatars">
              {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="User"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '2px solid var(--bg-deep)',
                    marginLeft: i > 0 ? -10 : 0,
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
            <div>
              <div className="stars">★★★★★</div>
              <div className="proof-text">
                {t('hero.socialProof1')} <strong>{t('hero.socialProof2')}</strong>
              </div>
            </div>
          </div>

          {/* Technova Apps Store Link Button */}
          <div style={{ marginTop: 22, opacity: 0, animation: 'riseIn 0.9s var(--ease-apple) forwards', animationDelay: '1.05s' }}>
            <a
              href="https://technovalearning.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                color: 'var(--gold-1)',
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span className="pulse-dot-ping" style={{
                  position: 'absolute',
                  display: 'inline-flex',
                  height: '100%',
                  width: '100%',
                  borderRadius: '50%',
                  backgroundColor: 'var(--coral-accent)',
                  opacity: 0.85
                }} />
                <span style={{
                  position: 'relative',
                  display: 'inline-flex',
                  borderRadius: '50%',
                  height: 8,
                  width: 8,
                  backgroundColor: 'var(--coral-accent)',
                  boxShadow: '0 0 8px var(--coral-accent)'
                }} />
              </span>
              Technova Apps Store
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginLeft: 2 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
        </div>

        {/* RIGHT: ANIMATED LISTENER */}
        <div className="stage">
          <div className="blob"></div>

          {/* minimalist solfège symbols orbiting the duo */}
          <div className="orbit">
            <div className="note-pos" style={{ transform: 'rotate(0deg) translate(245px)' }}><span className="note n1">♪</span></div>
            <div className="note-pos" style={{ transform: 'rotate(60deg) translate(245px)' }}><span className="note n2">𝄞</span></div>
            <div className="note-pos" style={{ transform: 'rotate(120deg) translate(245px)' }}><span className="note n3">♫</span></div>
            <div className="note-pos" style={{ transform: 'rotate(180deg) translate(245px)' }}><span className="note n4">♩</span></div>
            <div className="note-pos" style={{ transform: 'rotate(240deg) translate(245px)' }}><span className="note n5">♬</span></div>
            <div className="note-pos" style={{ transform: 'rotate(300deg) translate(245px)' }}><span className="note n6">♪</span></div>
          </div>

          <div className="duo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="ring" style={{ left: '50%', top: '50%' }}></div>
            <div className="ring" style={{ left: '50%', top: '50%' }}></div>
            <div className="ring" style={{ left: '50%', top: '50%' }}></div>

            <img
              src="/images/hero_duo_transparent.png"
              alt="Sonorya realistic music listeners"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 48px rgba(0, 0, 0, 0.75))'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
