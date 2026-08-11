export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = req.body || {};
    const apiKey = process.env.VITE_MUSIC_API_KEY || process.env.KIE_API_KEY || 'ce70092505bf96765228786f7116f9a4';

    console.log('[KIE.AI VERCEL] Sending generate request...');
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
    console.log('[KIE.AI VERCEL] Response:', generateData);

    if (!generateRes.ok) {
      return res.status(500).json({ error: 'API error', details: generateData });
    }

    let taskIds = [];
    if (generateData.data) {
      if (Array.isArray(generateData.data)) {
        taskIds = generateData.data.map(d => d.taskId || d.task_id || d.id).filter(Boolean);
      } else if (generateData.data.taskId || generateData.data.task_id || generateData.data.id) {
        taskIds = [generateData.data.taskId || generateData.data.task_id || generateData.data.id];
      }
    }
    if (taskIds.length === 0 && (generateData.taskId || generateData.task_id || generateData.id)) {
      taskIds = [generateData.taskId || generateData.task_id || generateData.id];
    }

    const checkAudioUrl = (obj) => {
      if (!obj) return null;
      if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://')) && (obj.includes('.mp3') || obj.includes('.wav'))) return obj;
      if (obj.audio_url) return obj.audio_url;
      if (obj.audioUrl) return obj.audioUrl;
      if (obj.audioWavUrl) return obj.audioWavUrl;
      if (obj.audio_download_url) return obj.audio_download_url;
      if (obj.sunoData && Array.isArray(obj.sunoData) && obj.sunoData[0]?.audioUrl) return obj.sunoData[0].audioUrl;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const url = checkAudioUrl(item);
          if (url) return url;
        }
      }
      if (obj.data) return checkAudioUrl(obj.data);
      return null;
    };

    const immediateUrl = checkAudioUrl(generateData);
    if (immediateUrl) {
      return res.status(200).json({ audio_url: immediateUrl });
    }

    if (taskIds.length === 0) {
      return res.status(400).json({ error: 'No task ID returned', raw: generateData });
    }

    const taskId = taskIds[0];
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise(r => setTimeout(r, 4000));
      try {
        const pollRes = await fetch(
          `https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (pollRes.ok) {
          const pollData = await pollRes.json();
          const audioUrl = checkAudioUrl(pollData);
          if (audioUrl) {
            return res.status(200).json({ audio_url: audioUrl });
          }
        }
      } catch (pollErr) {
        console.warn('[KIE.AI VERCEL] Poll error:', pollErr);
      }
    }

    return res.status(200).json({ error: 'Generation timed out', taskId });
  } catch (err) {
    console.error('[KIE.AI VERCEL] Handler error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
