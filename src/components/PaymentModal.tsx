import React, { useState } from 'react';
import { X, Smartphone, CreditCard, ShieldCheck, Check, Loader2, ArrowRight } from 'lucide-react';
import { Order, MobilePaymentProvider } from '../types/melodia';
import { usePricing } from '../context/PricingContext';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  orderDraft: Partial<Order>;
  onClose: () => void;
  onPaymentSuccess: (completedOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  orderDraft,
  onClose,
  onPaymentSuccess,
}) => {
  const [provider, setProvider] = useState<MobilePaymentProvider>('MTN MoMo');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'ussd_pending' | 'success'>('method');
  const { getPrice } = usePricing();

  const finalPrice = getPrice(orderDraft.priceFcfa || 2500);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider !== 'Carte Bancaire' && !phone.trim()) {
      alert('Veuillez saisir votre numéro Mobile Money.');
      return;
    }

    setIsProcessing(true);
    setStep('ussd_pending');

    // Simulate Moneroo Checkout Transaction Workflow (3s simulation)
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const finalOrder: Order = {
        id: 'MEL-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        occasion: orderDraft.occasion || 'Anniversaire',
        recipientName: orderDraft.recipientName || 'Mon Ami',
        story: orderDraft.story || '',
        genre: orderDraft.genre || 'Afrobeat',
        priceFcfa: orderDraft.priceFcfa || 2500,
        status: 'completed',
        paymentProvider: provider,
        paymentRef: 'MNR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        audioUrl: `https://sonorya.technova.app/download/song-${Math.floor(Math.random() * 1000)}.mp3`,
      };

      setTimeout(() => {
        onPaymentSuccess(finalOrder);
      }, 2000);
    }, 3200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Moneroo Payment Branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              GUICHET DE PAIEMENT SÉCURISÉ
            </div>
            <h3 style={{ fontFamily: 'Fraunces', fontSize: 22, marginTop: 2 }}>
              Checkout
            </h3>
          </div>
          <div style={{ background: 'rgba(212,161,57,0.15)', border: '1px solid var(--gold)', color: 'var(--gold-light)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
            {finalPrice.formatted}
          </div>
        </div>

        {step === 'method' && (
          <form onSubmit={handlePaySubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Sélectionnez le moyen de paiement</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 8 }}>
                {(['MTN MoMo', 'Wave', 'Orange Money', 'Moov Money', 'Carte Bancaire'] as MobilePaymentProvider[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    style={{
                      background: provider === p ? 'var(--gold)' : 'rgba(0,0,0,0.3)',
                      color: provider === p ? '#120A1E' : 'var(--ivory)',
                      border: provider === p ? '1px solid var(--gold)' : '1px solid var(--glass-border)',
                      borderRadius: 12,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: provider === p ? 700 : 500,
                      fontSize: 13,
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setProvider(p)}
                  >
                    {p === 'Carte Bancaire' ? <CreditCard size={16} /> : <Smartphone size={16} />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {provider !== 'Carte Bancaire' && (
              <div style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="phoneNum">
                  Numéro de téléphone {provider}
                </label>
                <input
                  type="text"
                  id="phoneNum"
                  placeholder="Ex. +229 97 00 00 00 / 01 97 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="cta">
              Régler {finalPrice.formatted}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 'ussd_pending' && (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <Loader2 size={42} className="text-gold animate-spin" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: 18, marginBottom: 8 }}>Validation en cours sur Moneroo...</h4>
            <p style={{ color: 'var(--ivory-dim)', fontSize: 14, maxWidth: 360, margin: '0 auto 16px' }}>
              Veuillez approuver la demande de prélèvement de <strong>{finalPrice.formatted}</strong> sur votre téléphone <strong>({phone || provider})</strong> via le menu USSD ou l'application.
            </p>
            <div style={{ fontSize: 12, color: 'var(--teal)' }}>
              🔒 Connexion directe avec le réseau {provider}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(47,217,196,0.2)', border: '2px solid var(--teal)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={32} />
            </div>
            <h4 style={{ fontSize: 22, fontFamily: 'Fraunces', marginBottom: 8 }}>Paiement Confirmé !</h4>
            <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 12 }}>
              Votre chanson pour <strong>{orderDraft.recipientName}</strong> est en cours de finalisation HD.
            </p>
            <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
              Redirection vers vos chansons...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
