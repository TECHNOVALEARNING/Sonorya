import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, ArrowLeft, Check, ShieldCheck, Loader2, Music, Music2, Wand2, Mic, Globe, Volume2, Image as ImageIcon, ChevronDown, Plus } from 'lucide-react';
import { UserProfile, Occasion, MusicalStyle, VoiceGender, SongLanguage, SongVibe, Song, MobilePaymentProvider, PaymentTransaction } from '../../types/melodia';
import { d1Database } from '../../services/d1Service';
import { CATEGORIES, MUSICAL_STYLES } from '../home/HomePage';
import { OpenAiService } from '../../services/openAiService';
import { KieService } from '../../services/kieService';
import confetti from 'canvas-confetti';
import { useTranslation } from '../../i18n/LanguageContext';
import { fr } from '../../i18n/translations/fr';
import { en } from '../../i18n/translations/en';
import { usePricing } from '../../context/PricingContext';

interface SongWizardProps {
  initialOccasion?: Occasion;
  initialGenre?: MusicalStyle;
  onClose: () => void;
  onSongCreated: (song: Song) => void;
  isEmbedded?: boolean;
  onDraftChange?: (draft: { title?: string; lyrics?: string; genre?: string }) => void;
  user?: UserProfile | null;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onOpenRechargeCredits?: () => void;
  recoveredSongMetadata?: any;
  onClearRecoveredMetadata?: () => void;
}

export const SongWizard: React.FC<SongWizardProps> = ({
  initialOccasion,
  initialGenre,
  onClose,
  onSongCreated,
  isEmbedded = true,
  onDraftChange,
  user,
  onUpdateUser,
  onOpenRechargeCredits,
  recoveredSongMetadata,
  onClearRecoveredMetadata
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'lyrics'>('description');
  const [isCustomOpen, setIsCustomOpen] = useState(true);
  const [isInstrumental, setIsInstrumental] = useState(false);

  const [step, setStep] = useState<number>(1);
  const [occasion, setOccasion] = useState<Occasion | 'Autre'>(initialOccasion || 'Anniversaire');
  const [customOccasion, setCustomOccasion] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [story, setStory] = useState('');
  const [customLyrics, setCustomLyrics] = useState('');
  const [genre, setGenre] = useState<MusicalStyle | 'Autre'>(initialGenre || 'Afrobeat');
  const [customGenre, setCustomGenre] = useState('');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('Duo / Mixte');
  const [language, setLanguage] = useState<SongLanguage>('Français');
  const [vibe, setVibe] = useState<SongVibe>('Joyeux & Festif');
  const [tempo, setTempo] = useState<number>(115);
  const [provider, setProvider] = useState<MobilePaymentProvider>('MTN MoMo');
  const [phone, setPhone] = useState('');

  // Generation animation state
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState('');
  
  const { t, lang } = useTranslation();

  // Intercepter le retour de paiement pour une chanson
  // Les metadata viennent des props (issues de App.tsx après vérification Moneroo)
  const paymentProcessedRef = React.useRef(false);
  
  useEffect(() => {
    // Ne traiter que s'il y a des metadata récupérées
    if (!recoveredSongMetadata || !user || paymentProcessedRef.current) return;
    
    paymentProcessedRef.current = true;
    
    try {
      const metadata = recoveredSongMetadata;
      
      // Restaurer les valeurs dans le wizard depuis les metadata Moneroo
      if (metadata.occasion) setOccasion(metadata.occasion as Occasion);
      if (metadata.genre) setGenre(metadata.genre as MusicalStyle);
      if (metadata.vibe) setVibe(metadata.vibe as SongVibe);
      if (metadata.voiceGender) setVoiceGender(metadata.voiceGender as VoiceGender);
      if (metadata.language) setLanguage(metadata.language as SongLanguage);
      if (metadata.recipientName) setRecipientName(metadata.recipientName);
      if (metadata.story) setStory(metadata.story);
      if (metadata.customLyrics) setCustomLyrics(metadata.customLyrics);
      if (metadata.isInstrumental === 'true') setIsInstrumental(true);
      if (metadata.tempo) setTempo(metadata.tempo);

      const paymentId = 'pay-' + Date.now();
      const paymentRef = 'MNR-SONG-' + Date.now();
      const payment: PaymentTransaction = {
        id: paymentId,
        userId: user.id,
        songId: '',
        reference: paymentRef,
        provider: 'Moneroo' as MobilePaymentProvider,
        amountFcfa: 0,
        phoneNumber: user.phone || '',
        status: 'successful',
        createdAt: new Date().toISOString()
      };
      d1Database.savePayment(payment);

      if (onClearRecoveredMetadata) {
        onClearRecoveredMetadata();
      }

      // Passer directement à l'animation de génération IA !
      setStep(7);
      startGeneration(payment, paymentRef);
    } catch (e) {
      console.error('[SONG VERIFY ERROR]', e);
      paymentProcessedRef.current = false;
    }
  }, [user, recoveredSongMetadata, onClearRecoveredMetadata]);
  const tBase = lang === 'FR' ? fr.wizard : en.wizard;
  const { getPrice } = usePricing();
  const catsBase = lang === 'FR' ? fr.categories : en.categories;

  // Broadcast draft changes to right panel
  useEffect(() => {
    if (onDraftChange) {
      const finalTitle = recipientName ? recipientName.trim() : occasion;
      const finalGenre = genre === 'Autre' ? (customGenre || 'Sur-mesure') : genre;
      const activeText = activeTab === 'lyrics' ? customLyrics : story;
      onDraftChange({
        title: finalTitle,
        genre: finalGenre,
        lyrics: activeText.trim() ? activeText : undefined
      });
    }
  }, [story, customLyrics, recipientName, genre, customGenre, occasion, activeTab]);

  const handleCreateClick = () => {
    if (activeTab === 'description' && !story.trim()) {
      alert(t('wizard.errors.story'));
      return;
    }
    if (activeTab === 'lyrics' && !customLyrics.trim()) {
      alert(lang === 'FR' ? 'Veuillez saisir vos paroles ou basculer sur l\'onglet Description.' : 'Please enter your lyrics or switch to Description tab.');
      return;
    }
    setStep(5); // Jump directly to summary / payment step
  };

  const [selectedPlan, setSelectedPlan] = useState<'single' | 'trio' | 'prestige'>('single');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const getPlanDetails = (plan: 'single' | 'trio' | 'prestige') => {
    switch (plan) {
      case 'trio':
        return { amount: getPrice(2999).amount, currency: getPrice(2999).currency, extraCredits: 2, label: `Pack 3 Musiques (${getPrice(2999).formatted})` };
      case 'prestige':
        return { amount: getPrice(7999).amount, currency: getPrice(7999).currency, extraCredits: 7, label: `Pack 8 Musiques (${getPrice(7999).formatted})` };
      default:
        return { amount: getPrice(1999).amount, currency: getPrice(1999).currency, extraCredits: 0, label: `Chanson Unique (${getPrice(1999).formatted})` };
    }
  };

  const userCredits = (user?.songCredits || 0) + (user?.bonusCredits || 0);

  // Use 1 credit for 0 FCFA if user has credits available
  const handleUseCredit = () => {
    if (userCredits <= 0) return;

    if (user) {
      const updatedCredits = Math.max(0, (user.songCredits || 0) - 1);
      const updatedUser = { ...user, songCredits: updatedCredits };
      d1Database.saveUser(updatedUser);
      onUpdateUser?.(updatedUser);
    }

    const paymentId = 'pay-' + Date.now();
    const paymentRef = 'CREDIT-' + Date.now();
    const payment: PaymentTransaction = {
      id: paymentId,
      userId: user?.id || 'user-current',
      songId: '',
      reference: paymentRef,
      provider: 'Crédit Compte' as MobilePaymentProvider,
      amountFcfa: 0,
      phoneNumber: user?.phone || '',
      status: 'successful',
      createdAt: new Date().toISOString()
    };
    d1Database.savePayment(payment);
    startGeneration(payment, paymentRef);
  };

  // Moneroo payment handler: Initialize payment via API, open checkout, and start generation
  const handlePayAndGenerate = async () => {
    setIsProcessingPayment(true);
    const { amount, currency, extraCredits, label } = getPlanDetails(selectedPlan);

    try {
      const songMetadata = {
        type: 'song',
        userId: user?.id || '',
        occasion: customOccasion || occasion,
        genre: customGenre || genre,
        vibe,
        voiceGender,
        language,
        recipientName,
        story: story.substring(0, 500), // Limiter la taille pour les metadata Moneroo
        customLyrics: customLyrics.substring(0, 1000),
        isInstrumental: isInstrumental ? 'true' : 'false',
        tempo,
        extraCredits: String(extraCredits),
        plan: selectedPlan
      };

      const returnUrl = `${window.location.origin}/?payment_status=verify_song`;

      const response = await fetch('/api/moneroo/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          description: `${label} - ${occasion} (${recipientName || 'Sonorya'})`,
          customer: {
            email: user?.email || 'client@sonorya.com',
            first_name: recipientName || 'Client',
            last_name: 'Sonorya',
            phone: phone || user?.phone || ''
          },
          return_url: returnUrl,
          metadata: songMetadata
        })
      });

      const data = await response.json();
      console.log('[MONEROO] Payment init result:', data);

      const checkoutUrl = data.data?.checkout_url || data.checkout_url;

      if (checkoutUrl) {
        // Redirection directe vers Moneroo – rien en localStorage
        window.location.href = checkoutUrl;
      } else {
        console.error('[MONEROO] No checkout URL received:', data);
        setIsProcessingPayment(false);
        alert(data.message || 'Erreur Moneroo : aucune URL de paiement reçue.');
      }
    } catch (err) {
      console.error('[MONEROO ERROR]', err);
      setIsProcessingPayment(false);
      alert('Erreur lors de l\'initialisation du paiement.');
    }
  };

  const startGeneration = async (payment: PaymentTransaction, paymentRef: string) => {
    setStep(7);
    setGenProgress(10);
    setGenMessage(tBase.generation.msg1);

    const runGenerationSteps = async () => {
      try {
        await new Promise(r => setTimeout(r, 1500));
        setGenProgress(40);
        setGenMessage(tBase.generation.msg2);

        const finalOccasion = (occasion === 'Autre' && customOccasion.trim()) ? customOccasion : occasion;
        const finalGenre = (genre === 'Autre' && customGenre.trim()) ? (customGenre as MusicalStyle) : (genre as MusicalStyle);

        let lyrics = '';
        if (isInstrumental) {
          lyrics = '[Musique Instrumentale Pur - Sans Voix]';
        } else if (customLyrics.trim()) {
          lyrics = customLyrics.trim();
        } else {
          lyrics = await OpenAiService.generateLyrics({
            occasion: finalOccasion,
            recipientName: recipientName || 'Destinataire',
            story: story || 'Une célébration spéciale',
            genre: finalGenre,
            voiceGender,
            language,
            vibe
          });
        }

        await new Promise(r => setTimeout(r, 1500));
        setGenProgress(75);
        setGenMessage(tBase.generation.msg3);

        const provider = recoveredSongMetadata?.transaction_id ? 'Moneroo' : 'Sonorya Credit';
        let musicResult;
        let songStatus: 'completed' | 'failed' = 'completed';

        try {
          musicResult = await KieService.generateMusic({
            lyrics,
            genre: finalGenre,
            voiceGender,
            tempo,
            title: recipientName ? recipientName.trim() : finalOccasion
          });
        } catch (err: any) {
          console.error('KieService failed:', err);
          songStatus = 'failed';
          musicResult = {
            audioUrl: '',
            previewAudioUrl: '',
            coverUrl: '',
            durationSeconds: 0
          };
        }

        await new Promise(r => setTimeout(r, 1500));
        setGenProgress(100);
        if (songStatus === 'completed') {
          setGenMessage(tBase.generation.msg4);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } else {
          setGenMessage("Génération terminée avec des erreurs (délai dépassé ou erreur API).");
        }

        const newSong: Song = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }),
          userId: 'user-current',
          title: recipientName ? recipientName.trim() : finalOccasion,
          occasion: finalOccasion,
          recipientName: recipientName || 'Destinataire',
          story: story || customLyrics,
          genre: finalGenre,
          voiceGender,
          language,
          vibe,
          tempo,
          durationSeconds: musicResult.durationSeconds || 180,
          lyrics: musicResult.lyrics || lyrics,
          audioUrl: musicResult.audioUrl,
          previewAudioUrl: musicResult.previewAudioUrl,
          coverUrl: musicResult.coverUrl,
          status: songStatus,
          isFavorite: true,
          downloadCount: 1,
          playCount: 1,
          priceFcfa: 2500,
          paymentProvider: provider,
          paymentRef: paymentRef,
          createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        // Update payment with the actual song ID
        payment.songId = newSong.id;
        d1Database.savePayment(payment);

        setTimeout(() => {
          onSongCreated(newSong);
        }, 1200);

      } catch (err: any) {
        console.error('Generation fatal error:', err);
        alert('Erreur critique: ' + err.message);
        onClose();
      }
    };

    runGenerationSteps();
  };

  const wizardInnerContent = (
    <div
      style={{
        background: '#090B10', // Deep elegant dark matching theme
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: '36px',
        width: '100%',
        margin: '0 auto 40px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
        position: 'relative'
      }}
    >
      {!isEmbedded && (
        <button 
          className="modal-close" 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 22, 
            right: 22, 
            background: 'rgba(255, 255, 255, 0.06)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            color: '#FFF', 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer' 
          }}
        >
          <X size={18} />
        </button>
      )}

      {/* Top Visual Stepper Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2DD4BF', boxShadow: '0 0 10px #2DD4BF' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {step === 7 ? 'Génération IA en cours' : step === 5 ? 'Étape Finale' : 'Création Sur-Mesure'}
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
            {step === 7 ? '100%' : step === 5 ? 'Récapitulatif' : 'Assistant Sonorya'}
          </span>
        </div>

        {/* Progress Bar Line */}
        <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: step === 7 ? `${genProgress}%` : step === 5 ? '90%' : '50%', 
              background: 'linear-gradient(90deg, #2DD4BF 0%, #0EA5E9 100%)', 
              borderRadius: 99,
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 12px rgba(45, 212, 191, 0.5)'
            }} 
          />
        </div>
      </div>

      {/* Top Tab Bar (Description & Paroles) */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('description')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            borderRadius: 14,
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            background: activeTab === 'description' 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(255, 255, 255, 0.035)',
            color: activeTab === 'description' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
            border: activeTab === 'description' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
            boxShadow: activeTab === 'description' ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Wand2 size={16} /> Description & Histoire
        </button>

        <button
          onClick={() => setActiveTab('lyrics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            borderRadius: 14,
            fontSize: 13.5,
            fontWeight: 800,
            cursor: 'pointer',
            background: activeTab === 'lyrics' 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(255, 255, 255, 0.035)',
            color: activeTab === 'lyrics' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
            border: activeTab === 'lyrics' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
            boxShadow: activeTab === 'lyrics' ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Music2 size={16} /> Vos Paroles Propres
        </button>
      </div>

      {step < 5 ? (
        <>
          {/* Active Tab View */}
          {activeTab === 'description' ? (
            /* Main Card: Describe the Song */
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: 22,
                padding: 24,
                marginBottom: 20
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px', fontFamily: 'Manrope, sans-serif' }}>
                  Décrivez votre histoire
                </h4>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.5 }}>
                  Racontez des souvenirs personnels, le prénom de la personne ou des émotions. L'IA de Sonorya composera des paroles authentiques.
                </p>
              </div>

              {/* Prompt Input Box */}
              <div style={{ position: 'relative' }}>
                <textarea
                  placeholder="Racontez un souvenir, un prénom, une émotion..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  maxLength={1000}
                  style={{
                    width: '100%',
                    minHeight: 140,
                    padding: 18,
                    borderRadius: 16,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    color: '#FFFFFF',
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 16,
                    fontSize: 11.5,
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 600
                  }}
                >
                  {story.length}/1000
                </div>
              </div>
            </div>
          ) : (
            /* Main Card: Custom Lyrics */
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: 22,
                padding: 24,
                marginBottom: 20
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px', fontFamily: 'Manrope, sans-serif' }}>
                  Vos propres paroles
                </h4>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.5 }}>
                  Collez vos couplets ou refrains rédigés par vos soins. L'IA chantera votre texte mot pour mot.
                </p>
              </div>

              {/* Lyrics Input Box */}
              <div style={{ position: 'relative' }}>
                <textarea
                  placeholder="[Couplet 1]&#10;Dans tes yeux brille une étincelle...&#10;&#10;[Refrain]&#10;Joyeux anniversaire Sarah..."
                  value={customLyrics}
                  onChange={(e) => setCustomLyrics(e.target.value)}
                  maxLength={2000}
                  style={{
                    width: '100%',
                    minHeight: 160,
                    padding: 18,
                    borderRadius: 16,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    color: '#FFFFFF',
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 16,
                    fontSize: 11.5,
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 600
                  }}
                >
                  {customLyrics.length}/2000
                </div>
              </div>
            </div>
          )}

          {/* Custom Section Accordion */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 20,
              padding: '18px 22px',
              marginBottom: 16
            }}
          >
            <div
              onClick={() => setIsCustomOpen(!isCustomOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <h5 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
                Personnalisation (Occasion, Style, Voix...)
              </h5>
              <ChevronDown
                size={18}
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  transform: isCustomOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </div>

            {isCustomOpen && (
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Name Input */}
                <div>
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                    Prénom du destinataire / Titre
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Sarah, Koffi, Adjoa..."
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: 14, 
                      background: 'rgba(0,0,0,0.3)', 
                      border: '1px solid rgba(255,255,255,0.09)', 
                      color: '#fff', 
                      fontSize: 14.5,
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Occasion Categories */}
                <div>
                  <label className="form-label" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                    Occasion
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxHeight: 180, overflowY: 'auto' }}>
                    {CATEGORIES.map((cat) => {
                      const translatedCat = (catsBase as any)?.[cat.name] || cat;
                      const isSelected = occasion === cat.name;
                      return (
                        <div
                          key={cat.name}
                          style={{
                            background: isSelected 
                              ? 'linear-gradient(180deg, rgba(45, 212, 191, 0.18) 0%, rgba(14, 165, 233, 0.08) 100%)' 
                              : 'rgba(0, 0, 0, 0.25)',
                            border: isSelected ? '2px solid #2DD4BF' : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 14,
                            padding: 10,
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                            transform: isSelected ? 'translateY(-1px)' : 'none'
                          }}
                          onClick={() => setOccasion(cat.name)}
                        >
                          <img src={cat.cover} alt={cat.name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', margin: '0 auto 6px' }} />
                          <div style={{ fontSize: 11.5, fontWeight: isSelected ? 800 : 600, color: isSelected ? '#2DD4BF' : '#FFFFFF' }}>
                            {cat.name === 'Autre' ? (lang === 'FR' ? 'Sur-mesure' : 'Custom') : translatedCat.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Style & Voice dropdowns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                      Style Musical
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value as any)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 14px', 
                        borderRadius: 14, 
                        background: '#12141D', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: '#fff', 
                        fontSize: 14,
                        outline: 'none'
                      }}
                    >
                      {MUSICAL_STYLES.map(g => <option key={g} value={g}>{g}</option>)}
                      <option value="Autre">Autre (Préciser)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                      Type de Voix
                    </label>
                    <select
                      value={voiceGender}
                      onChange={(e) => setVoiceGender(e.target.value as VoiceGender)}
                      style={{ 
                        width: '100%', 
                        padding: '12px 14px', 
                        borderRadius: 14, 
                        background: '#12141D', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: '#fff', 
                        fontSize: 14,
                        outline: 'none'
                      }}
                    >
                      <option value="Masculine">Voix Masculine</option>
                      <option value="Féminine">Voix Féminine</option>
                      <option value="Duo / Mixte">Duo / Mixte</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pure Instrumental Toggle Switch */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 20,
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24
            }}
          >
            <div>
              <h5 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 2px' }}>
                Pure Instrumental (Sans Voix)
              </h5>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Générer uniquement la mélodie instrumentale pour fond sonore
              </p>
            </div>

            {/* Toggle Switch */}
            <div
              onClick={() => setIsInstrumental(!isInstrumental)}
              style={{
                width: 46,
                height: 26,
                borderRadius: 99,
                background: isInstrumental ? 'linear-gradient(135deg, #2DD4BF, #0EA5E9)' : 'rgba(255,255,255,0.15)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  position: 'absolute',
                  top: 3,
                  left: isInstrumental ? 23 : 3,
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          </div>

          {/* Primary Action Button: + Créer ma chanson */}
          <button
            onClick={handleCreateClick}
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #F5B978 0%, #E89E53 100%)',
              color: '#090B10',
              border: 'none',
              fontSize: 16,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(245, 185, 120, 0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <Plus size={20} /> Créer ma chanson
          </button>
        </>
      ) : (
        /* Summary & Generation Steps */
        <div>
          {step === 5 && (
            <div style={{ 
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.015) 100%)', 
              border: '1px solid rgba(255, 255, 255, 0.09)', 
              borderRadius: 24, 
              padding: 28 
            }}>
              <div style={{ fontSize: 12, color: '#2DD4BF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                Récapitulatif de votre création
              </div>
              <h4 style={{ fontSize: 22, margin: '0 0 16px', color: '#FFFFFF', fontWeight: 800 }}>
                Musique pour {recipientName || 'Vous'}
              </h4>

              <ul style={{ listStyle: 'none', fontSize: 14.5, color: 'rgba(255,255,255,0.8)', lineHeight: 2.1, padding: 0, marginBottom: 24 }}>
                <li><strong style={{ color: '#FFFFFF' }}>Occasion:</strong> {occasion}</li>
                <li><strong style={{ color: '#FFFFFF' }}>Style Musical:</strong> {genre}</li>
                <li><strong style={{ color: '#FFFFFF' }}>Voix & Langue:</strong> {voiceGender} · {language}</li>
              </ul>

              {userCredits > 0 ? (
                <div style={{ 
                  background: 'linear-gradient(180deg, rgba(45, 212, 191, 0.14) 0%, rgba(14, 165, 233, 0.06) 100%)', 
                  border: '1.5px solid #2DD4BF', 
                  borderRadius: 20, 
                  padding: 20, 
                  marginBottom: 24, 
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(45, 212, 191, 0.15)'
                }}>
                  <img src="/images/sonorya-app-logo.png" alt="Sonorya" style={{ width: 26, height: 26, borderRadius: 6, marginBottom: 8, objectFit: 'cover' }} />
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px' }}>
                    Solde actuel : {userCredits} {userCredits > 1 ? 'crédits disponibles' : 'crédit disponible'}
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    1 crédit sera déduit de votre compte pour générer ce morceau.
                  </p>
                </div>
              ) : (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  borderRadius: 20, 
                  padding: 20, 
                  marginBottom: 24, 
                  textAlign: 'center' 
                }}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#F87171', margin: '0 0 4px' }}>
                    Solde insuffisant : 0 crédit disponible
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    Veuillez recharger vos crédits de création sur votre compte pour lancer la génération.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 14 }}>
                <button className="btn-glass" style={{ flex: 1, padding: '16px', borderRadius: 16 }} onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Modifier
                </button>

                {userCredits > 0 ? (
                  <button 
                    className="btn-coral" 
                    style={{ 
                      flex: 2, 
                      padding: '16px 24px', 
                      fontSize: 16, 
                      fontWeight: 800,
                      justifyContent: 'center', 
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #F5B978 0%, #E89E53 100%)',
                      color: '#090B10',
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(245, 185, 120, 0.3)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }} 
                    onClick={handleUseCredit}
                  >
                    🎵 Générer ma musique (1 crédit)
                  </button>
                ) : (
                  <button 
                    style={{ 
                      flex: 2, 
                      padding: '16px 24px', 
                      fontSize: 16, 
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #F5B978 0%, #E89E53 100%)',
                      color: '#090B10',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(245, 185, 120, 0.3)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }} 
                    onClick={() => onOpenRechargeCredits ? onOpenRechargeCredits() : setStep(1)}
                  >
                    🛒 Recharger mes crédits (Dès 1 999 F)
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 7 && (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, rgba(45,212,191,0.2) 0%, rgba(14,165,233,0.1) 100%)',
                  border: '2px solid #2DD4BF',
                  boxShadow: '0 0 30px rgba(45, 212, 191, 0.4)',
                  animation: 'pulse 2s infinite ease-in-out'
                }} />
                <Loader2 size={40} style={{ color: '#2DD4BF', zIndex: 2 }} className="animate-spin" />
              </div>

              <h4 style={{ fontSize: 24, marginBottom: 8, color: '#FFFFFF', fontWeight: 800, letterSpacing: '-0.01em' }}>
                Génération de votre chanson en cours...
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14.5, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.5 }}>
                {genMessage}
              </p>

              <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', maxWidth: 440, margin: '0 auto' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${genProgress}%`, 
                    background: 'linear-gradient(90deg, #2DD4BF 0%, #0EA5E9 100%)', 
                    borderRadius: 99,
                    transition: 'width 0.5s ease',
                    boxShadow: '0 0 16px rgba(45, 212, 191, 0.6)'
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return (
      <section id="create-wizard" style={{ width: '100%' }}>
        {wizardInnerContent}
      </section>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        {wizardInnerContent}
      </div>
    </div>
  );
};
