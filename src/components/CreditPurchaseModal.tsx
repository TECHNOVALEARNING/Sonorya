import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Check, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { UserProfile, MobilePaymentProvider, PaymentTransaction } from '../types/melodia';
import { d1Database } from '../services/d1Service';
import { useToast } from './ToastProvider';
import { usePricing } from '../context/PricingContext';

interface CreditPurchaseModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile, creditsAdded: number) => void;
  onOpenLogin: () => void;
}

export const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({
  user,
  onClose,
  onSuccess,
  onOpenLogin
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'trio' | 'prestige'>('trio');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const { getPrice } = usePricing();

  const singlePrice = getPrice(1999);
  const trioPrice = getPrice(2999);
  const prestigePrice = getPrice(7999);

  const plans = [
    {
      id: 'single' as const,
      name: 'Chanson Unique',
      credits: 1,
      price: singlePrice.amount,
      formattedPrice: singlePrice.formatted,
      currency: singlePrice.currency,
      unitPrice: `${singlePrice.formatted} / titre`,
      badge: 'Découverte',
      desc: '1 Chanson personnalisée complète',
      popular: false
    },
    {
      id: 'trio' as const,
      name: 'Pack 3 Musiques',
      credits: 3,
      price: trioPrice.amount,
      formattedPrice: trioPrice.formatted,
      currency: trioPrice.currency,
      unitPrice: `~${getPrice(999).formatted} / titre`,
      badge: '⭐ POPULAIRE (-50%)',
      desc: '3 Chansons créées (crédits à vie)',
      popular: true
    },
    {
      id: 'prestige' as const,
      name: 'Pack 8 Musiques',
      credits: 8,
      price: prestigePrice.amount,
      formattedPrice: prestigePrice.formatted,
      currency: prestigePrice.currency,
      unitPrice: `~${getPrice(999).formatted} / titre`,
      badge: '🔥 MEILLEUR PRIX',
      desc: '8 Chansons créées (crédits à vie)',
      popular: false
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];

  const handlePurchase = async () => {
    if (!user) {
      onClose();
      onOpenLogin();
      return;
    }

    setIsProcessing(true);

    try {
      const returnUrl = `${window.location.origin}/?payment_status=verify`;

      const response = await fetch('/api/moneroo/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentPlan.price,
          currency: currentPlan.currency,
          description: `Achat de ${currentPlan.credits} crédits Sonorya - ${user.fullName || user.email}`,
          customer: {
            email: user.email,
            first_name: user.fullName || 'Client',
            last_name: 'Sonorya',
            phone: phone || user.phone || ''
          },
          return_url: returnUrl
        })
      });

      const data = await response.json();
      const checkoutUrl = data.data?.checkout_url || data.checkout_url;
      const transactionId = data.data?.id || null;

      if (checkoutUrl) {
        // Sauvegarder l'intention d'achat avec le transactionId AVANT de quitter le site
        localStorage.setItem('sonorya_pending_purchase', JSON.stringify({
          plan: currentPlan.id,
          credits: currentPlan.credits,
          userId: user.id,
          monerooTransactionId: transactionId
        }));
        
        // Redirection totale vers Moneroo
        window.location.href = checkoutUrl;
      } else {
        console.error('[CREDIT PURCHASE] No checkout URL:', data);
        setIsProcessing(false);
        showToast(data.message || "Erreur Moneroo : aucune URL de paiement reçue.", "error");
      }
    } catch (e) {
      console.error('[CREDIT PURCHASE] Error:', e);
      setIsProcessing(false);
      showToast("Erreur lors de l'initialisation du paiement.", "error");
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999, 
        background: 'rgba(7, 10, 18, 0.88)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 20 
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          background: 'linear-gradient(180deg, rgba(22, 25, 38, 0.98) 0%, rgba(14, 17, 27, 0.98) 100%)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: 28, 
          padding: '32px 30px', 
          maxWidth: 520, 
          width: '100%', 
          position: 'relative', 
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.75)',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 20, 
            right: 20, 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            color: 'rgba(255,255,255,0.7)', 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',
            border: '1px solid rgba(45, 212, 191, 0.4)',
            color: '#2DD4BF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(45, 212, 191, 0.2)'
          }}>
            <img src="/images/sonorya-app-logo.png" alt="Sonorya" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Recharger vos Crédits
          </h3>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', maxWidth: 360, margin: '0 auto', lineHeight: 1.5 }}>
            Choisissez votre formule. Vos crédits restent utilisables **à vie** sans aucune date d'expiration.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(180deg, rgba(45, 212, 191, 0.18) 0%, rgba(14, 165, 233, 0.08) 100%)' 
                    : 'rgba(255, 255, 255, 0.025)',
                  border: isSelected ? '2px solid #2DD4BF' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 18,
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: isSelected ? '0 10px 25px rgba(45, 212, 191, 0.2)' : 'none',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {p.popular && (
                  <span style={{ 
                    position: 'absolute', 
                    top: -11, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    background: '#2DD4BF', 
                    color: '#0F172A', 
                    fontSize: 9, 
                    fontWeight: 900, 
                    padding: '2px 8px', 
                    borderRadius: 99, 
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(45, 212, 191, 0.4)'
                  }}>
                    POPULAIRE
                  </span>
                )}
                <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
                  {p.credits} {p.credits > 1 ? 'Titres' : 'Titre'}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: isSelected ? '#2DD4BF' : '#FFFFFF' }}>
                  {p.formattedPrice}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--gold)', fontWeight: 700, marginTop: 4 }}>
                  {p.unitPrice}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Summary Banner */}
        <div style={{ 
          background: 'rgba(45, 212, 191, 0.06)', 
          border: '1px solid rgba(45, 212, 191, 0.2)', 
          borderRadius: 20, 
          padding: 18, 
          marginBottom: 20, 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 2 }}>
            Total de votre recharge
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#2DD4BF', letterSpacing: '-0.01em' }}>
            {currentPlan.formattedPrice}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span>Acheter {currentPlan.credits} {currentPlan.credits > 1 ? 'crédits de création' : 'crédit de création'}</span>
          </div>

          {/* Payment providers logos bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 8, 
            marginTop: 12, 
            paddingTop: 10, 
            borderTop: '1px solid rgba(255,255,255,0.06)', 
            fontSize: 10.5, 
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 600
          }}>
            <Smartphone size={13} style={{ color: '#2DD4BF' }} />
            <span>MTN MoMo · Moov Money · Wave · Orange Money</span>
            <CreditCard size={13} style={{ color: '#0EA5E9', marginLeft: 4 }} />
            <span>Carte CB</span>
          </div>
        </div>

        {/* Optional Mobile Money Phone Number */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
            Numéro Mobile Money (optionnel)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: 97 00 00 00"
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0, 0, 0, 0.25)',
              color: '#FFFFFF',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          />
        </div>

        {/* Main CTA Button */}
        <button
          className="btn-coral"
          style={{ 
            width: '100%', 
            padding: '16px 24px', 
            fontSize: 16, 
            fontWeight: 800,
            justifyContent: 'center', 
            borderRadius: 16,
            background: 'linear-gradient(135deg, #2DD4BF 0%, #0EA5E9 100%)',
            color: '#0F172A',
            border: 'none',
            boxShadow: '0 10px 30px rgba(45, 212, 191, 0.35)',
            opacity: isProcessing ? 0.7 : 1,
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
          onClick={handlePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>Initialisation Moneroo... <Loader2 size={18} className="animate-spin" /></>
          ) : (
            <>💳 Payer {currentPlan.formattedPrice} & Créditer Mon Compte <ShieldCheck size={18} /></>
          )}
        </button>

        {/* Trust Subtext */}
        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginTop: 14, marginBottom: 0 }}>
          🔒 Guichet sécurisé par Moneroo · Sonorya by Technova
        </p>
      </div>
    </div>
  );
};
