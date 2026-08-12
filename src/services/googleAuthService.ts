/// <reference types="vite/client" />
import { supabase } from './supabaseClient';

/**
 * Trigger Supabase Google OAuth Sign-In
 */
export async function triggerGoogleSignIn(
  onSuccess: () => void,
  onError: (errMessage: string) => void
) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirection URL is typically handled automatically by Supabase, 
        // but can be explicitly set in the Supabase Dashboard
        redirectTo: window.location.origin
      }
    });

    if (error) {
      onError(error.message);
    } else {
      // onSuccess is generally unreached because signInWithOAuth triggers a window redirect
      onSuccess(); 
    }
  } catch (err) {
    console.error('Google SignIn Error:', err);
    onError('Erreur inattendue lors de la connexion Google');
  }
}

