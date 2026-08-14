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
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

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
    
    let supabase;
    if (token && !supabaseServiceKey) {
      // Create client with user's JWT token
      supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY || '', {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
    } else {
      // Fallback to service key if available
      supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.VITE_SUPABASE_ANON_KEY || '');
    }

    // Lire les crédits actuels
    const { data: userData, error: readError } = await supabase
      .from('users')
      .select('song_credits')
      .eq('id', userId)
      .single();

    if (readError) {
      console.error('[CREDIT] Supabase read error:', readError);
      return res.status(500).json({ error: 'Failed to read user credits', details: readError.message });
    }

    const currentCredits = userData?.song_credits || 0;
    const newCredits = currentCredits + creditsToAdd;

    // Écrire les nouveaux crédits
    const { error: updateError } = await supabase
      .from('users')
      .update({ song_credits: newCredits })
      .eq('id', userId);

    if (updateError) {
      console.error('[CREDIT] Supabase update error:', updateError);
      return res.status(500).json({ error: 'Failed to update credits', details: updateError.message });
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
