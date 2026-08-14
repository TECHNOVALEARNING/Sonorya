import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kie-ai-music-proxy',
      configureServer(server) {
        // Helper: escape a value for safe inclusion in SQL strings passed via shell
        const sqlEscape = (val: any): string => {
          if (val === null || val === undefined) return '';
          return String(val)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "''")
            .replace(/"/g, '\\"')
            .replace(/\n/g, ' ')
            .replace(/\r/g, '')
            .replace(/\t/g, ' ');
        };

        // POST /api/generate-music → proxy to kie.ai
        server.middlewares.use('/api/generate-music', async (req: any, res: any) => {
          if (req.method !== 'POST') { res.end(); return; }

          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const apiKey = process.env.VITE_MUSIC_API_KEY || 'ce70092505bf96765228786f7116f9a4';

              // ── Step 1: Generate (async task) ──
              console.log('[KIE.AI] Sending generate request...');
              const generateRes = await fetch('https://api.kie.ai/api/v1/generate', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  customMode: true,
                  instrumental: false,
                  prompt: (parsed.lyrics || parsed.prompt || '[Verse]\nLa la la melodie').substring(0, 3000),
                  style: `${parsed.genre || 'Afrobeat'}, ${parsed.voiceGender === 'Féminine' ? 'female vocals' : parsed.voiceGender === 'Masculine' ? 'male vocals' : 'male and female duet vocals'}, melodic, upbeat, african`,
                  title: (parsed.title || 'Chanson Sonorya').substring(0, 80),
                  model: 'V4',
                  callBackUrl: 'https://sonorya.technova.app/api/callback'
                })
              });

              const generateData = await generateRes.json();
              console.log('[KIE.AI] Generate response:', JSON.stringify(generateData).substring(0, 500));

              if (!generateRes.ok) {
                console.error('[KIE.AI] Generate failed:', generateData);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'API error', details: generateData }));
                return;
              }

              // Extract task ID(s) from response
              // kie.ai may return: { data: [{ taskId: "..." }] } or { data: { taskId: "..." } }
              let taskIds: string[] = [];
              if (generateData.data) {
                if (Array.isArray(generateData.data)) {
                  taskIds = generateData.data
                    .map((d: any) => d.taskId || d.task_id || d.id)
                    .filter(Boolean);
                } else if (generateData.data.taskId || generateData.data.task_id || generateData.data.id) {
                  taskIds = [generateData.data.taskId || generateData.data.task_id || generateData.data.id];
                }
              }
              if (taskIds.length === 0 && (generateData.taskId || generateData.task_id || generateData.id)) {
                taskIds = [generateData.taskId || generateData.task_id || generateData.id];
              }

              // Check if audio URL is already in the generate response
              const checkAudioUrl = (obj: any, depth = 0): string | null => {
                if (!obj || depth > 6) return null;
                
                // Direct string URL check (relaxed: any http URL is a candidate)
                if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))) {
                  // Accept any URL that looks like an audio file
                  if (obj.includes('.mp3') || obj.includes('.wav') || obj.includes('.m4a') || 
                      obj.includes('.ogg') || obj.includes('.flac') || obj.includes('.aac') ||
                      obj.includes('/audio') || obj.includes('cdn') || obj.includes('storage')) {
                    return obj;
                  }
                }

                if (typeof obj !== 'object') return null;

                // Check all known audio URL field names  
                const audioFields = [
                  'audio_url', 'audioUrl', 'audioWavUrl', 'audio_download_url',
                  'mp3_url', 'mp3Url', 'song_url', 'songUrl', 'music_url', 'musicUrl',
                  'stream_url', 'streamUrl', 'download_url', 'downloadUrl',
                  'media_url', 'mediaUrl', 'file_url', 'fileUrl', 'url',
                  'audio_mp3_url', 'output_url', 'result_url',
                  'streamAudioUrl', 'sourceStreamAudioUrl', 'sourceAudioUrl'
                ];
                
                for (const field of audioFields) {
                  if (obj[field] && typeof obj[field] === 'string' && 
                      (obj[field].startsWith('http://') || obj[field].startsWith('https://'))) {
                    return obj[field];
                  }
                }

                // Check sunoData structure
                if (obj.sunoData && Array.isArray(obj.sunoData) && obj.sunoData.length > 0) {
                  for (const item of obj.sunoData) {
                    const url = checkAudioUrl(item, depth + 1);
                    if (url) return url;
                  }
                }

                // Check arrays
                if (Array.isArray(obj)) {
                  for (const item of obj) {
                    const url = checkAudioUrl(item, depth + 1);
                    if (url) return url;
                  }
                }

                // Recurse into known nested objects
                const nestedFields = ['data', 'response', 'result', 'output', 'record', 'task', 'item', 'items', 'tracks'];
                for (const field of nestedFields) {
                  if (obj[field]) {
                    const url = checkAudioUrl(obj[field], depth + 1);
                    if (url) return url;
                  }
                }

                return null;
              };

              // Also extract image URL
              const checkImageUrl = (obj: any, depth = 0): string | null => {
                if (!obj || depth > 6) return null;
                if (typeof obj !== 'object') return null;
                
                const imageFields = ['image_url', 'imageUrl', 'cover_url', 'coverUrl', 'img_url', 'imgUrl', 'artwork_url', 'image_large_url'];
                for (const field of imageFields) {
                  if (obj[field] && typeof obj[field] === 'string' && 
                      (obj[field].startsWith('http://') || obj[field].startsWith('https://'))) {
                    return obj[field];
                  }
                }
                if (obj.data) return checkImageUrl(obj.data, depth + 1);
                if (obj.response) return checkImageUrl(obj.response, depth + 1);
                if (Array.isArray(obj)) {
                  for (const item of obj) {
                    const url = checkImageUrl(item, depth + 1);
                    if (url) return url;
                  }
                }
                return null;
              };

              const immediateUrl = checkAudioUrl(generateData);
              if (immediateUrl) {
                const imageUrl = checkImageUrl(generateData);
                console.log('[KIE.AI] Got immediate audio URL:', immediateUrl);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ audio_url: immediateUrl, image_url: imageUrl }));
                return;
              }

              if (taskIds.length === 0) {
                console.error('[KIE.AI] No task IDs found in response');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'No task ID returned', raw: generateData }));
                return;
              }

              console.log('[KIE.AI] Task IDs:', taskIds);

              // ── Step 2: Poll for completion ──
              // kie.ai docs: GET /api/v1/generate/record-info?taskId=xxx
              const taskId = taskIds[0];

              for (let attempt = 0; attempt < 60; attempt++) {
                await new Promise(r => setTimeout(r, 5000)); // 5s between polls
                console.log(`[KIE.AI] Polling attempt ${attempt + 1}/60 for task ${taskId}...`);

                try {
                  const pollRes = await fetch(
                    `https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`,
                    {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  );

                  if (pollRes.ok) {
                    const pollData = await pollRes.json();
                    // Log full response for debugging (up to 2000 chars)
                    console.log(`[KIE.AI] Poll response (full):`, JSON.stringify(pollData).substring(0, 2000));

                    const audioUrl = checkAudioUrl(pollData);
                    if (audioUrl) {
                      const imageUrl = checkImageUrl(pollData);
                      console.log('[KIE.AI] ✅ Got audio URL:', audioUrl);
                      console.log('[KIE.AI] 🖼️ Got image URL:', imageUrl);
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ audio_url: audioUrl, image_url: imageUrl }));
                      return;
                    }

                    // Check status field
                    const status = pollData.status || pollData.data?.status || '';
                    console.log(`[KIE.AI] Task status: "${status}"`);
                    if (typeof status === 'string' && (
                      status.toUpperCase() === 'FAILED' ||
                      status.toUpperCase() === 'ERROR'
                    )) {
                      console.error('[KIE.AI] Task failed:', pollData);
                      break;
                    }
                  } else {
                    console.warn(`[KIE.AI] Poll returned status ${pollRes.status}`);
                  }
                } catch (pollErr) {
                  console.warn('[KIE.AI] Poll error:', pollErr);
                }
              }

              // If we get here, polling timed out
              console.warn('[KIE.AI] Polling timed out after 5 minutes');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Generation timed out', taskId }));

            } catch (err) {
              console.error('[KIE.AI] Proxy error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        });

        // POST /api/users → Insert or update user in Cloudflare D1
        server.middlewares.use('/api/users', async (req: any, res: any) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const user = JSON.parse(body || '{}');
                if (user.id && user.email) {
                  const { exec } = await import('child_process');

                  const sql = `INSERT OR REPLACE INTO users (id, email, full_name, avatar_url, phone, country, role, status, referral_code, bonus_credits) VALUES ('${sqlEscape(user.id)}', '${sqlEscape(user.email)}', '${sqlEscape(user.fullName)}', '${sqlEscape(user.avatarUrl)}', '${sqlEscape(user.phone)}', '${sqlEscape(user.country || 'Bénin')}', '${sqlEscape(user.role || 'user')}', '${sqlEscape(user.status || 'active')}', '${sqlEscape(user.referralCode)}', ${parseInt(user.bonusCredits) || 0});`;

                  console.log('[D1 DATABASE] Saving user into Cloudflare D1:', user.id, user.email);

                  exec(`npx wrangler d1 execute sonorya-db --remote --command="${sql}"`, (err) => {
                    if (err) console.error('[D1 REMOTE USER] Error:', err.message);
                    else console.log('[D1 REMOTE USER] ✅ Saved successfully');
                  });
                  exec(`npx wrangler d1 execute sonorya-db --local --command="${sql}"`, (err) => {
                    if (err) console.info('[D1 LOCAL USER] Notice:', err.message);
                    else console.log('[D1 LOCAL USER] ✅ Saved successfully');
                  });
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                console.error('[D1 USER] Parse error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          }
        });

        // POST & GET /api/songs → Insert or query songs in Cloudflare D1
        server.middlewares.use('/api/songs', async (req: any, res: any) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const song = JSON.parse(body || '{}');
                if (song.id && song.title) {
                  const { exec } = await import('child_process');

                  const sql = `INSERT OR REPLACE INTO songs (id, user_id, title, occasion, recipient_name, story, genre, voice_gender, language, vibe, tempo, duration_seconds, lyrics, audio_url, preview_audio_url, cover_url, status, is_favorite, price_fcfa) VALUES ('${sqlEscape(song.id)}', '${sqlEscape(song.userId || 'user-current')}', '${sqlEscape(song.title)}', '${sqlEscape(song.occasion || 'Anniversaire')}', '${sqlEscape(song.recipientName)}', '${sqlEscape(song.story)}', '${sqlEscape(song.genre || 'Afrobeat')}', '${sqlEscape(song.voiceGender || 'Duo / Mixte')}', '${sqlEscape(song.language || 'Français')}', '${sqlEscape(song.vibe || 'Joyeux')}', ${parseInt(song.tempo) || 115}, ${parseInt(song.durationSeconds) || 120}, '${sqlEscape(song.lyrics)}', '${sqlEscape(song.audioUrl)}', '${sqlEscape(song.previewAudioUrl)}', '${sqlEscape(song.coverUrl)}', '${sqlEscape(song.status || 'completed')}', ${song.isFavorite ? 1 : 0}, ${parseInt(song.priceFcfa) || 2500});`;

                  console.log('[D1 DATABASE] Saving song into Cloudflare D1:', song.id, song.title);

                  exec(`npx wrangler d1 execute sonorya-db --remote --command="${sql}"`, (err) => {
                    if (err) console.error('[D1 REMOTE SONG] ❌ Error:', err.message);
                    else console.log('[D1 REMOTE SONG] ✅ Saved successfully');
                  });
                  exec(`npx wrangler d1 execute sonorya-db --local --command="${sql}"`, (err) => {
                    if (err) console.info('[D1 LOCAL SONG] Notice:', err.message);
                    else console.log('[D1 LOCAL SONG] ✅ Saved successfully');
                  });
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                console.error('[D1 SONG] Parse error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          }
        });

        // POST /api/payments → Insert payment in Cloudflare D1
        server.middlewares.use('/api/payments', async (req: any, res: any) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const payment = JSON.parse(body || '{}');
                if (payment.id && payment.userId) {
                  const { exec } = await import('child_process');

                  const sql = `INSERT OR REPLACE INTO payments (id, user_id, song_id, reference, provider, amount_fcfa, phone_number, status) VALUES ('${sqlEscape(payment.id)}', '${sqlEscape(payment.userId)}', '${sqlEscape(payment.songId)}', '${sqlEscape(payment.reference)}', '${sqlEscape(payment.provider)}', ${parseInt(payment.amountFcfa) || 2500}, '${sqlEscape(payment.phoneNumber)}', '${sqlEscape(payment.status || 'successful')}');`;

                  console.log('[D1 DATABASE] Saving payment into Cloudflare D1:', payment.id, payment.reference);

                  exec(`npx wrangler d1 execute sonorya-db --remote --command="${sql}"`, (err) => {
                    if (err) console.error('[D1 REMOTE PAYMENT] ❌ Error:', err.message);
                    else console.log('[D1 REMOTE PAYMENT] ✅ Saved successfully');
                  });
                  exec(`npx wrangler d1 execute sonorya-db --local --command="${sql}"`, (err) => {
                    if (err) console.info('[D1 LOCAL PAYMENT] Notice:', err.message);
                    else console.log('[D1 LOCAL PAYMENT] ✅ Saved successfully');
                  });
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                console.error('[D1 PAYMENT] Parse error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          }
        });

        // POST /api/moneroo/initialize → Moneroo Payment Gateway Initialization
        server.middlewares.use('/api/moneroo/initialize', async (req: any, res: any) => {
          if (req.method !== 'POST') { res.end(); return; }

          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const monerooApiKey = process.env.VITE_MONEROO_API_KEY || 'pvk_wuaku5|01KZRX559GAV881JTXAGW7R5EG';

              console.log('[MONEROO] Initializing payment for amount:', parsed.amount || 2500, 'XOF');

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
              console.log('[MONEROO] Response:', responseData);

              res.setHeader('Content-Type', 'application/json');
              if (response.ok) {
                res.end(JSON.stringify(responseData));
              } else {
                res.statusCode = response.status || 400;
                res.end(JSON.stringify(responseData));
              }
            } catch (err) {
              console.error('[MONEROO] Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
});
