/// <reference types="vite/client" />

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleUserPayload {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export function parseGoogleJwt(token: string): GoogleUserPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

export function loadGoogleGsiScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id || window.google?.accounts?.oauth2) {
      resolve(true);
      return;
    }
    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function triggerGoogleSignIn(
  onSuccess: (googleUser: GoogleUserPayload) => void,
  onError: (errMessage: string) => void
) {
  loadGoogleGsiScript().then((loaded) => {
    if (!loaded || !window.google?.accounts) {
      onError('Impossible de charger le service Google Sign-In.');
      return;
    }

    const clientId =
      ((import.meta as any).env && (import.meta as any).env.VITE_GOOGLE_CLIENT_ID) ||
      '962557762691-8l2k6u6s53m6e6912345.apps.googleusercontent.com';

    try {
      // 1. Try Google Identity Services One Tap / Credential prompt first
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          if (response.credential) {
            const payload = parseGoogleJwt(response.credential);
            if (payload && payload.email) {
              onSuccess(payload);
            } else {
              onError('Impossible de lire les informations du compte Google.');
            }
          } else {
            onError('Connexion Google annulée.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.prompt((notification: any) => {
        const isNotDisplayed = notification.isNotDisplayed && notification.isNotDisplayed();
        const isSkipped = notification.isSkippedMoment && notification.isSkippedMoment();
        const isDismissed = notification.isDismissedMoment && notification.isDismissedMoment();

        if (isNotDisplayed || isSkipped || isDismissed) {
          // 2. Fallback to Google OAuth2 Popup flow
          if (window.google.accounts.oauth2) {
            const client = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: 'email profile openid',
              callback: async (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                  try {
                    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                      headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                    });
                    const userInfo = await res.json();
                    if (userInfo && userInfo.email) {
                      onSuccess({
                        sub: userInfo.sub || 'usr-google-' + Date.now(),
                        name: userInfo.name || userInfo.email.split('@')[0],
                        email: userInfo.email,
                        picture: userInfo.picture
                      });
                    } else {
                      onError('Informations de profil Google introuvables.');
                    }
                  } catch (e) {
                    onError('Erreur de récupération du profil Google.');
                  }
                } else {
                  onError('La fenêtre de connexion Google a été fermée.');
                }
              }
            });
            client.requestAccessToken();
          }
        }
      });
    } catch (e) {
      onError('Erreur lors du lancement de la connexion Google.');
    }
  });
}
