import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ToastProvider } from './components/ToastProvider';
import { LanguageProvider } from './i18n/LanguageContext';

// Purge temporaire de l'ancien système de cache (à retirer une fois la migration Supabase terminée)
if (!localStorage.getItem('supabase_migration_cleared_v1')) {
  console.log('🧹 Purge complète des anciennes données locales pour la migration Supabase...');
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('supabase_migration_cleared_v1', 'true');
  window.location.reload();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LanguageProvider>
  </React.StrictMode>
);
