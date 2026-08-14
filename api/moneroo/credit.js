import { createClient } from '@supabase/supabase-js';

/**
 * Endpoint sécurisé côté serveur qui :
 * 1. Vérifie la transaction Moneroo
 * 2. Lit les metadata (userId, credits) depuis la réponse Moneroo
 * 3. Incrémente song_credits dans Supabase
 * 
 * Retourne les crédits finaux de l'utilisateur.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionId } = req.body || {};

    if (!transactionId) {
      return res.status(400).json({ error: 'Missing transactionId' });
    }

    const monerooApiKey = process.env.VITE_MONEROO_API_KEY || process.env.MONEROO_API_KEY || '';
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';

    // 1. Vérifier la transaction auprès de Moneroo
    console.log('[CREDIT] Verifying Moneroo transaction:', transactionId);
    
    const verifyResponse = await fetch(`https://api.moneroo.io/v1/payments/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${monerooApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const verifyData = await verifyResponse.json();
    console.log('[CREDIT] Moneroo verify response:', JSON.stringify(verifyData));

    const txStatus = String(verifyData.data?.status || verifyData.status || '').toLowerCase();

    // 2. Rejeter les transactions échouées
    if (['failed', 'cancelled', 'canceled', 'expired', 'declined'].includes(txStatus)) {
      return res.status(400).json({ 
        error: 'Payment failed or cancelled', 
        status: txStatus 
      });
    }

    // 3. Extraire metadata
    const metadata = verifyData.data?.metadata || {};
    const userId = metadata.userId;
    const creditsToAdd = parseInt(metadata.credits, 10) || 0;
    const type = metadata.type || 'unknown';

    console.log('[CREDIT] Metadata:', { userId, creditsToAdd, type, txStatus });

    if (!userId || creditsToAdd <= 0) {
      return res.status(400).json({ 
        error: 'Invalid metadata: missing userId or credits',
        metadata 
      });
    }

    // 4. Mettre à jour les crédits dans Supabase
    // Extract token to act on behalf of the user to pass RLS policies
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    
    // Check if real service role key exists
    const realServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
    
    // Use the best available token for authorization
    const authToken = token || realServiceKey || anonKey;

    // --- Lire les crédits actuels via REST API ---
    const readResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=song_credits`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!readResponse.ok) {
      const errorText = await readResponse.text();
      console.error('[CREDIT] Supabase read error:', errorText);
      return res.status(500).json({ error: 'Failed to read user credits', details: errorText });
    }

    const readData = await readResponse.json();
    if (!readData || readData.length === 0) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    const currentCredits = readData[0].song_credits || 0;
    const newCredits = currentCredits + creditsToAdd;

    // --- Mettre à jour les crédits via REST API ---
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ song_credits: newCredits })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('[CREDIT] Supabase update error:', errorText);
      return res.status(500).json({ error: 'Failed to update credits', details: errorText });
    }

    console.log('[CREDIT] Success:', { userId, added: creditsToAdd, total: newCredits });

    return res.status(200).json({
      success: true,
      credits: newCredits,
      added: creditsToAdd,
      type,
      monerooStatus: txStatus,
      metadata
    });
  } catch (err) {
    console.error('[CREDIT] Handler error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
