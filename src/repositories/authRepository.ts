import { UserProfile } from '../types/melodia';
import { d1Database } from '../services/d1Service';

// Admin credentials
const ADMIN_EMAIL = 'admin@technova.com';
const ADMIN_PASSWORD = 'Sonorya2026!';

const ADMIN_USER: UserProfile = {
  id: 'user-admin',
  email: ADMIN_EMAIL,
  fullName: 'Admin Technova',
  avatarUrl: '',
  phone: '+229 90 90 90 90',
  country: 'Bénin',
  role: 'admin',
  referralCode: 'SONORYA-ADMIN',
  bonusCredits: 9999,
  createdAt: '01 Jan 2026',
  totalSongs: 12,
  status: 'active'
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr-901',
  email: 'client@technova.app',
  fullName: 'Adjoa Mensah',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phone: '',
  country: 'Bénin',
  role: 'user',
  referralCode: 'SONORYA-ADJOA901',
  bonusCredits: 1000,
  status: 'active'
};

export class AuthRepository {
  private currentUser: UserProfile | null = null;
  private registeredUsers: Map<string, UserProfile> = new Map();

  constructor() {
    this.loadUsers();
    this.loadUser();
  }

  private loadUsers() {
    try {
      const saved = localStorage.getItem('sonorya_registered_users');
      if (saved) {
        const list: UserProfile[] = JSON.parse(saved);
        for (const u of list) {
          if (u && u.email) {
            this.registeredUsers.set(u.email.toLowerCase().trim(), u);
          }
        }
      }
    } catch (e) {}

    // Add default entries
    this.registeredUsers.set(ADMIN_EMAIL.toLowerCase(), ADMIN_USER);
    this.registeredUsers.set(DEFAULT_USER.email.toLowerCase(), DEFAULT_USER);

    // Sync with Cloudflare D1 asynchronously
    d1Database.getUsers().then(d1Users => {
      for (const u of d1Users) {
        if (u && u.email) {
          this.registeredUsers.set(u.email.toLowerCase().trim(), u);
        }
      }
      this.persistRegisteredUsers();
    }).catch(() => {});
  }

  private persistRegisteredUsers() {
    try {
      const list = Array.from(this.registeredUsers.values());
      localStorage.setItem('sonorya_registered_users', JSON.stringify(list));
    } catch (e) {}
  }

  private loadUser() {
    try {
      const saved = sessionStorage.getItem('sonorya_current_user') || localStorage.getItem('sonorya_current_user');
      if (saved) {
        this.currentUser = JSON.parse(saved);
      }
    } catch (e) {}
  }

  public getCurrentUser(): UserProfile | null {
    if (!this.currentUser) {
      this.loadUser();
    }
    return this.currentUser;
  }

  private persistUser(user: UserProfile) {
    this.currentUser = user;
    try {
      sessionStorage.setItem('sonorya_current_user', JSON.stringify(user));
      localStorage.setItem('sonorya_current_user', JSON.stringify(user));
    } catch (e) {}
    d1Database.saveUser(user);
  }

  public loginWithEmail(email: string, password?: string): { user: UserProfile | null; error?: string } {
    const cleanEmail = email.trim().toLowerCase();

    // Admin login check
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      if (password === ADMIN_PASSWORD || password === 'Melodia2026!') {
        this.currentUser = { ...ADMIN_USER };
        this.persistUser(this.currentUser);
        return { user: this.currentUser };
      }
      return { user: null, error: 'invalid_password' };
    }

    // Check if user already exists
    let existing = this.registeredUsers.get(cleanEmail);
    if (existing) {
      this.persistUser(existing);
      return { user: existing };
    }

    // Regular user login / new creation
    const userId = 'usr-' + Math.floor(100000 + Math.random() * 900000);
    const newUser: UserProfile = {
      id: userId,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0] || 'Utilisateur Sonorya',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      phone: '',
      country: 'Bénin',
      role: 'user',
      referralCode: 'REF-' + Math.floor(100000 + Math.random() * 900000),
      bonusCredits: 0,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalSongs: 0,
      status: 'active'
    };

    this.registeredUsers.set(cleanEmail, newUser);
    this.persistRegisteredUsers();
    this.persistUser(newUser);
    return { user: newUser };
  }

  public signupWithEmail(email: string, password: string, fullName: string): { user: UserProfile | null; error?: string } {
    const cleanEmail = email.trim().toLowerCase();

    // Check if email is already taken
    if (this.registeredUsers.has(cleanEmail)) {
      return { user: null, error: 'email_taken' };
    }

    const userId = 'usr-' + Math.floor(100000 + Math.random() * 900000);
    const newUser: UserProfile = {
      id: userId,
      email: cleanEmail,
      fullName: fullName || cleanEmail.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      phone: '',
      country: 'Bénin',
      role: 'user',
      referralCode: 'REF-' + Math.floor(100000 + Math.random() * 900000),
      bonusCredits: 0,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalSongs: 0,
      status: 'active'
    };

    this.registeredUsers.set(cleanEmail, newUser);
    this.persistRegisteredUsers();
    this.persistUser(newUser);
    return { user: newUser };
  }

  public loginWithGooglePayload(payload: { sub: string; email: string; name: string; picture?: string }): UserProfile {
    const cleanEmail = payload.email.trim().toLowerCase();

    // Check if user already exists
    let existing = this.registeredUsers.get(cleanEmail);
    if (existing) {
      if (payload.picture && !existing.avatarUrl) {
        existing.avatarUrl = payload.picture;
      }
      this.persistUser(existing);
      return existing;
    }

    const googleId = 'usr-g-' + payload.sub.replace(/[^a-zA-Z0-9]/g, '');
    const newUser: UserProfile = {
      id: googleId,
      email: cleanEmail,
      fullName: payload.name || cleanEmail.split('@')[0],
      avatarUrl: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      phone: '',
      country: 'Bénin',
      role: 'user',
      referralCode: 'REF-G-' + payload.sub.slice(-6),
      bonusCredits: 0,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalSongs: 0,
      status: 'active'
    };

    this.registeredUsers.set(cleanEmail, newUser);
    this.persistRegisteredUsers();
    this.persistUser(newUser);
    return newUser;
  }

  public loginWithProvider(provider: 'google' | 'apple'): UserProfile {
    const isGoogle = provider === 'google';
    const randId = Math.floor(100000 + Math.random() * 900000);
    const email = isGoogle ? `utilisateur.google.${randId}@gmail.com` : `utilisateur.apple.${randId}@icloud.com`;
    const cleanEmail = email.toLowerCase();

    let existing = this.registeredUsers.get(cleanEmail);
    if (existing) {
      this.persistUser(existing);
      return existing;
    }

    const newUser: UserProfile = {
      id: 'usr-' + provider + '-' + randId,
      email,
      fullName: isGoogle ? `Utilisateur Google (${randId})` : `Utilisateur Apple (${randId})`,
      avatarUrl: isGoogle 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      phone: '',
      country: 'Bénin',
      role: 'user',
      referralCode: 'REF-' + randId,
      bonusCredits: 0,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalSongs: 0,
      status: 'active'
    };

    this.registeredUsers.set(cleanEmail, newUser);
    this.persistRegisteredUsers();
    this.persistUser(newUser);
    return newUser;
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      if (this.currentUser.email) {
        this.registeredUsers.set(this.currentUser.email.toLowerCase().trim(), this.currentUser);
        this.persistRegisteredUsers();
      }
      this.persistUser(this.currentUser);
    }
    return this.currentUser || DEFAULT_USER;
  }

  public logout(): void {
    this.currentUser = null;
    try {
      localStorage.removeItem('sonorya_current_user');
      sessionStorage.removeItem('sonorya_current_user');
    } catch (e) {}
  }
}

export const authRepository = new AuthRepository();
