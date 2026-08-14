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

    console.log('[MONEROO VERIFY] Checking transaction:', transactionId);

    const response = await fetch(`https://api.moneroo.io/v1/payments/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${monerooApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const responseData = await response.json();
    console.log('[MONEROO VERIFY] Result:', JSON.stringify(responseData));
    
    return res.status(response.status || 200).json(responseData);
  } catch (err) {
    console.error('[MONEROO VERIFY] Handler error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
