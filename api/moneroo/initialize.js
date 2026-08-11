export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = req.body || {};
    const monerooApiKey = process.env.VITE_MONEROO_API_KEY || process.env.MONEROO_API_KEY || 'pvk_wuaku5|01KZRX559GAV881JTXAGW7R5EG';

    console.log('[MONEROO VERCEL] Initializing payment:', parsed.amount || 2500, 'XOF');

    const response = await fetch('https://api.moneroo.io/v1/payments/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${monerooApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: parsed.amount || 2500,
        currency: parsed.currency || 'XOF',
        description: parsed.description || 'Création de chanson personnalisée - Sonorya',
        customer: {
          email: parsed.customer?.email || 'client@sonorya.com',
          first_name: parsed.customer?.first_name || 'Client',
          last_name: parsed.customer?.last_name || 'Sonorya',
          phone: parsed.customer?.phone || ''
        },
        return_url: parsed.return_url || 'https://sonorya.technova.app/dashboard',
        metadata: parsed.metadata || {}
      })
    });

    const responseData = await response.json();
    return res.status(response.status || 200).json(responseData);
  } catch (err) {
    console.error('[MONEROO VERCEL] Handler error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
