import { UserProfile } from '../types/melodia';
import { supabase } from '../services/supabaseClient';

export class AuthRepository {
  private currentUser: UserProfile | null = null;
  private onUserChangeCallbacks: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    // Start listening to auth changes immediately
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (session?.user) {
        await this.syncProfile(session.user.id);
      } else {
        this.currentUser = null;
        this.notifyListeners();
      }
    });
    
    // Initial fetch
    this.init();
  }

  private async init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await this.syncProfile(session.user.id);
    }
  }

  private async syncProfile(userId: string) {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (data && !error) {
        this.currentUser = {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          phone: data.phone || '',
          country: data.country || 'Bénin',
          role: data.role as 'admin' | 'user',
          referralCode: data.referral_code,
          bonusCredits: data.bonus_credits || 0,
          songCredits: data.song_credits || 0,
          createdAt: data.created_at,
          totalSongs: 0,
          status: data.status
        };
        this.notifyListeners();
      }
    } catch (e) {
      console.error('Error syncing profile:', e);
    }
  }

  public subscribe(callback: (user: UserProfile | null) => void) {
    this.onUserChangeCallbacks.push(callback);
    callback(this.currentUser); // immediate invoke
    return () => {
      this.onUserChangeCallbacks = this.onUserChangeCallbacks.filter(c => c !== callback);
    };
  }

  private notifyListeners() {
    this.onUserChangeCallbacks.forEach(cb => cb(this.currentUser));
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public async loginWithEmail(email: string, password?: string): Promise<{ user: UserProfile | null; error?: string }> {
    if (!password) return { user: null, error: 'invalid_password' };
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      await this.syncProfile(data.user.id);
      return { user: this.currentUser };
    }
    
    return { user: null, error: 'unknown_error' };
  }

  public async signupWithEmail(email: string, password: string, fullName: string): Promise<{ user: UserProfile | null; error?: string }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Trigger takes care of inserting into public.users, but we might need a small delay before syncing
      await new Promise(r => setTimeout(r, 1000));
      await this.syncProfile(data.user.id);
      return { user: this.currentUser };
    }
    
    return { user: null, error: 'unknown_error' };
  }

  public async loginWithGooglePayload(payload: any): Promise<UserProfile> {
    // This is no longer used for Google Sign In natively, we use signInWithOAuth directly.
    // However, to satisfy TypeScript / interface compatibility temporarily, we throw an error.
    throw new Error("Use googleAuthService.signInWithGoogle instead");
  }

  public async loginWithProvider(provider: 'google' | 'apple'): Promise<UserProfile> {
    throw new Error("Use googleAuthService.signInWithGoogle instead");
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentUser) return this.currentUser as any;

    const dbUpdates = {
      full_name: updates.fullName,
      phone: updates.phone,
      country: updates.country,
      avatar_url: updates.avatarUrl
    };

    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]);

    const { data, error } = await supabase.from('users').update(dbUpdates).eq('id', this.currentUser.id).select().single();
    
    if (data && !error) {
      await this.syncProfile(this.currentUser.id);
    }
    
    return this.currentUser!;
  }

  public async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser = null;
    this.notifyListeners();
  }
}

export const authRepository = new AuthRepository();
