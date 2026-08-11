export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const song = req.body || {};
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      const databaseId = process.env.CLOUDFLARE_DATABASE_ID || 'c662159a-4425-4557-9087-f4e3390209be';
      const token = process.env.CLOUDFLARE_API_TOKEN;

      if (token && accountId && song.id) {
        const sql = `INSERT OR REPLACE INTO songs (id, user_id, title, occasion, recipient_name, story, genre, lyrics, audio_url, cover_url, price_fcfa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const params = [song.id, song.userId || 'user-1', song.title || '', song.occasion || '', song.recipientName || '', song.story || '', song.genre || '', song.lyrics || '', song.audioUrl || '', song.coverUrl || '', song.priceFcfa || 2500];

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
      console.warn('[VERCEL SONGS API]', e);
    }
  }
  return res.status(200).json({ success: true });
}
