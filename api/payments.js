export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payment = req.body || {};
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const databaseId = process.env.CLOUDFLARE_DATABASE_ID || 'c662159a-4425-4557-9087-f4e3390209be';
      const token = process.env.CLOUDFLARE_API_TOKEN;

      if (token && accountId && payment.id) {
        const sql = `INSERT OR REPLACE INTO payments (id, user_id, song_id, reference, provider, amount_fcfa, phone_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
        const params = [payment.id, payment.userId || 'user-1', payment.songId || '', payment.reference || '', payment.provider || 'Moneroo', parseInt(payment.amountFcfa) || 2500, payment.phoneNumber || '', payment.status || 'successful'];

        await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sql, params })
        });
      }
    } catch (e) {
      console.warn('[VERCEL PAYMENTS API]', e);
    }
  }
  return res.status(200).json({ success: true });
}
