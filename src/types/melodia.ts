export type Occasion =
  | 'Anniversaire'
  | 'Mariage'
  | 'Demande en mariage'
  | 'Baptême'
  | 'Dot'
  | 'Réussite scolaire'
  | 'Réussite professionnelle'
  | 'Hommage'
  | 'Encouragement'
  | 'Remerciement'
  | 'Excuses'
  | 'Fun'
  | 'Juste pour le plaisir'
  | 'Autre'
  | (string & {});

export type MusicalStyle =
  | 'Afrobeat'
  | 'Amapiano'
  | 'Zouk'
  | 'Coupé-Décalé'
  | 'Highlife'
  | 'Mbalax'
  | 'Gospel'
  | 'RnB'
  | 'Rap'
  | 'Drill'
  | 'Trap'
  | 'Acoustique'
  | 'Pop'
  | 'Soul'
  | 'Reggae'
  | 'Jazz'
  | 'Classique'
  | 'Traditionnel';

export type Genre = MusicalStyle;

export type VoiceGender = 'Masculine' | 'Féminine' | 'Duo / Mixte';
export type SongLanguage = 'Français' | 'Anglais' | 'Fon' | 'Yoruba' | 'Lingala' | 'Wolof';
export type SongVibe = 'Joyeux & Festif' | 'Émouvant & Poétique' | 'Dansant & Énergique' | 'Doux & Romantique' | 'Solennel & Profond';

export type MobilePaymentProvider =
  | 'Moneroo'
  | 'MTN MoMo'
  | 'Moov Money'
  | 'Orange Money'
  | 'Wave'
  | 'Carte Bancaire'
  | (string & {});

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  phone: string;
  country: string;
  role: 'user' | 'admin';
  referralCode?: string;
  bonusCredits?: number;
  songCredits?: number;
  createdAt?: string;
  totalSongs?: number;
  status?: 'active' | 'banned' | 'suspended';
}

export interface Song {
  id: string;
  userId?: string;
  title?: string;
  occasion: Occasion;
  recipientName: string;
  story: string;
  genre: MusicalStyle;
  voiceGender?: VoiceGender;
  language?: SongLanguage;
  vibe?: SongVibe;
  tempo?: number;
  durationSeconds?: number;
  lyrics?: string;
  audioUrl?: string;
  previewAudioUrl?: string;
  coverUrl?: string;
  status?: 'pending' | 'generating' | 'completed' | 'failed' | 'preview_ready' | 'payment_pending';
  isFavorite?: boolean;
  isDownloaded?: boolean;
  downloadCount?: number;
  playCount?: number;
  priceFcfa?: number;
  createdAt: string;

  // Compatibility fields
  paymentProvider?: MobilePaymentProvider;
  paymentRef?: string;
  lyricsSnippet?: string;
  fullLyrics?: string;
  packName?: string;
}

export type Order = Song;

export interface DemoTrack {
  id: string;
  title: string;
  occasion: Occasion;
  genre: Genre;
  durationSeconds: number;
  snippetDescription: string;
  tempo: number;
  keyNote: string;
  coverUrl: string;
  lyrics: string;
  audioSampleUrl?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  songId?: string;
  reference: string;
  provider: MobilePaymentProvider;
  amountFcfa: number;
  phoneNumber?: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface SeasonalPack {
  id: string;
  name: string;
  badge: string;
  description: string;
  priceFcfa: number;
  originalPriceFcfa: number;
  popularGenre: MusicalStyle;
  defaultOccasion: Occasion;
  coverUrl?: string;
  features: string[];
}

export interface TestimonialReview {
  id: string;
  authorName?: string;
  location?: string;
  occasion?: Occasion | string;
  rating: number;
  comment?: string;
  avatarUrl?: string;
  date?: string;

  // Compatibility fields
  quote?: string;
  author?: string;
}

export type Testimonial = TestimonialReview;

export interface AdminAnalytics {
  totalUsers: number;
  activeUsersToday: number;
  totalRevenueFcfa: number;
  totalSongsGenerated: number;
  totalDownloads: number;
  recentPayments: PaymentTransaction[];
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  currentUses: number;
  maxUses: number;
  isActive: boolean;
  expiresAt: string;
}
