import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface IzimeloPricingProps {
  onOpenCreate: () => void;
  onSelectPlan?: (planId: 'single' | 'trio' | 'prestige') => void;
}

export const IzimeloPricing: React.FC<IzimeloPricingProps> = ({ onOpenCreate, onSelectPlan }) => {
  const { lang } = useTranslation();

  const plans = [
    {
      id: 'single',
      name: lang === 'FR' ? 'Chanson Unique' : 'Single Song',
      badge: lang === 'FR' ? 'Découverte' : 'Starter',
      price: '1 999',
      unitPrice: lang === 'FR' ? '1 999 FCFA / musique' : '1,999 FCFA / song',
      desc: lang === 'FR' ? 'Idéal pour offrir une chanson personnalisée sur-mesure pour une occasion spéciale.' : 'Ideal for creating a custom personalized song for a special occasion.',
      popular: false,
      cta: lang === 'FR' ? 'Créer ma chanson' : 'Create my song',
      features: [
        lang === 'FR' ? '1 Chanson personnalisée complète (~2 min)' : '1 Full custom song (~2 min)',
        lang === 'FR' ? 'Paroles sur-mesure chantées' : 'Custom written & sung lyrics',
        lang === 'FR' ? 'Pochette d\'album HD générée' : 'Generated HD album cover art',
        lang === 'FR' ? 'Téléchargement MP3 HD immédiat' : 'Instant HD MP3 download',
        lang === 'FR' ? 'Qualité audio studio premium' : 'Premium studio audio quality'
      ]
    },
    {
      id: 'trio',
      name: lang === 'FR' ? 'Pack 3 Musiques' : '3 Songs Pack',
      badge: lang === 'FR' ? '⭐ Le Plus Populaire' : '⭐ Most Popular',
      price: '2 999',
      unitPrice: lang === 'FR' ? '~1 000 FCFA / musique · Économie de 50%' : '~1,000 FCFA / song · 50% Savings',
      desc: lang === 'FR' ? 'La formule préférée ! Profitez de 3 créations musicales valables à vie sur votre compte.' : 'Our best-selling plan! Get 3 custom song credits with lifetime validity.',
      popular: true,
      cta: lang === 'FR' ? 'Commander le Pack Trio' : 'Get 3-Song Pack',
      features: [
        lang === 'FR' ? '3 Musiques créées (1 immédiate + 2 crédits)' : '3 Songs created (1 instant + 2 credits)',
        lang === 'FR' ? 'Crédits valables à vie sans expiration' : 'Lifetime validity for remaining credits',
        lang === 'FR' ? 'Toutes voix (HF/Mixte) & tous styles' : 'All voices & musical styles included',
        lang === 'FR' ? 'Paroles sur-mesure & pochette HD' : 'Custom lyrics & HD cover art',
        lang === 'FR' ? 'Support client prioritaire 7j/7' : '7/7 Priority customer support'
      ]
    },
    {
      id: 'prestige',
      name: lang === 'FR' ? 'Pack 8 Musiques' : '8 Songs Pack',
      badge: lang === 'FR' ? '🔥 Meilleur Prix' : '🔥 Best Value',
      price: '7 999',
      unitPrice: lang === 'FR' ? '~1 000 FCFA / musique · Économie maximale' : '~1,000 FCFA / song · Maximum Savings',
      desc: lang === 'FR' ? 'Le pack idéal pour les familles, mariages, anniversaires ou créateurs de contenu.' : 'The ultimate bundle for families, events, or content creators.',
      popular: false,
      cta: lang === 'FR' ? 'Profiter de l\'Offre Prestige' : 'Get Prestige Pack',
      features: [
        lang === 'FR' ? '8 Musiques créées (1 immédiate + 7 crédits)' : '8 Songs created (1 instant + 7 credits)',
        lang === 'FR' ? 'Crédits valables à vie sur votre compte' : 'Lifetime credit balance',
        lang === 'FR' ? 'Partage & Téléchargements MP3 illimités' : 'Unlimited MP3 downloads & sharing',
        lang === 'FR' ? 'Accès en avant-première aux nouveautés' : 'Early access to new features',
        lang === 'FR' ? 'Assistance VIP dédiée sur WhatsApp' : 'Dedicated VIP WhatsApp assistance'
      ]
    }
  ];

  return (
    <section className="wrap" id="pricing" style={{ padding: '90px 24px 70px', textAlign: 'center' }}>
      {/* Top Pill Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(45, 212, 191, 0.12)',
        border: '1px solid rgba(45, 212, 191, 0.3)',
        borderRadius: 99,
        padding: '6px 16px',
        color: '#2DD4BF',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.05em',
        marginBottom: 16
      }}>
        <img src="/images/sonorya-app-logo.png" alt="Sonorya" style={{ width: 16, height: 16, borderRadius: 4, objectFit: 'cover' }} />
        <span>{lang === 'FR' ? 'Tarifs & Formules' : 'Pricing & Plans'}</span>
      </div>

      {/* Heading */}
      <h2 style={{ fontSize: 38, fontWeight: 800, color: '#FFFFFF', marginBottom: 12, lineHeight: 1.2 }}>
        {lang === 'FR' ? 'Des tarifs transparents adaptés à vos ' : 'Plans that fit your '}
        <span style={{ color: '#2DD4BF' }}>{lang === 'FR' ? 'moments forts' : 'scale'}</span>
      </h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 16, maxWidth: 620, margin: '0 auto 52px', lineHeight: 1.6 }}>
        {lang === 'FR' 
          ? 'Choisissez la formule idéale sans aucun abonnement ni engagement. Vos crédits restent disponibles à vie sur votre compte.' 
          : 'Simple, transparent pricing. No hidden subscription fees. Credits are valid for life.'}
      </p>

      {/* Pricing Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'stretch' }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.popular 
                ? 'linear-gradient(180deg, rgba(45, 212, 191, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)' 
                : 'rgba(255, 255, 255, 0.02)',
              border: plan.popular ? '2px dashed #2DD4BF' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 24,
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: plan.popular ? '0 16px 40px rgba(45, 212, 191, 0.15)' : 'none',
              transform: plan.popular ? 'scale(1.03)' : 'none',
              zIndex: plan.popular ? 2 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <div>
              {/* Header inside card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ivory-dim)' }}>{plan.name}</span>
                {plan.popular ? (
                  <span style={{
                    background: '#2DD4BF',
                    color: '#0F172A',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: 99,
                    boxShadow: '0 2px 10px rgba(45, 212, 191, 0.4)'
                  }}>
                    {plan.badge}
                  </span>
                ) : (
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--gold)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 99
                  }}>
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#2DD4BF' }}>FCFA</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginBottom: 16, textAlign: 'left' }}>
                {plan.unitPrice}
              </div>

              {/* Description */}
              <p style={{ fontSize: 13.5, color: 'var(--ivory-dim)', textAlign: 'left', marginBottom: 24, lineHeight: 1.5, minHeight: 40 }}>
                {plan.desc}
              </p>

              {/* Button */}
              <button
                className={plan.popular ? 'btn-coral' : 'btn-emerald'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '15px 20px',
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 32,
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #2DD4BF, #0EA5E9)' 
                    : 'rgba(255,255,255,0.06)',
                  color: plan.popular ? '#0F172A' : '#FFFFFF',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: plan.popular ? '0 8px 24px rgba(45, 212, 191, 0.35)' : 'none'
                }}
                onClick={() => onSelectPlan ? onSelectPlan(plan.id as any) : onOpenCreate()}
              >
                {plan.cta} <ArrowRight size={16} />
              </button>

              {/* Features List */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
                  {lang === 'FR' ? 'INCLUS DANS LA FORMULE :' : 'WHAT\'S INCLUDED:'}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, fontSize: 13.5, color: 'var(--ivory)' }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: 'rgba(45, 212, 191, 0.15)',
                        color: '#2DD4BF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom trust footer */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              <ShieldCheck size={14} style={{ color: '#2DD4BF' }} />
              <span>{lang === 'FR' ? 'Paiement Sécurisé Mobile Money & CB' : 'Secure Mobile Money & Card Payment'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
