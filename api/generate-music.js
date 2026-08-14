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

    const checkAudioUrl = (obj, depth = 0) => {
      if (!obj || depth > 6) return null;
      
      if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))) {
        if (obj.includes('.mp3') || obj.includes('.wav') || obj.includes('.m4a') || 
            obj.includes('.ogg') || obj.includes('.flac') || obj.includes('.aac') ||
            obj.includes('/audio') || obj.includes('cdn') || obj.includes('storage')) {
          return obj;
        }
      }

      if (typeof obj !== 'object') return null;

      const audioFields = [
        'audio_url', 'audioUrl', 'audioWavUrl', 'audio_download_url',
        'mp3_url', 'mp3Url', 'song_url', 'songUrl', 'music_url', 'musicUrl',
        'stream_url', 'streamUrl', 'download_url', 'downloadUrl',
        'media_url', 'mediaUrl', 'file_url', 'fileUrl', 'url',
        'audio_mp3_url', 'output_url', 'result_url'
      ];
      
      for (const field of audioFields) {
        if (obj[field] && typeof obj[field] === 'string' && 
            (obj[field].startsWith('http://') || obj[field].startsWith('https://'))) {
          return obj[field];
        }
      }

      if (obj.sunoData && Array.isArray(obj.sunoData) && obj.sunoData.length > 0) {
        for (const item of obj.sunoData) {
          const url = checkAudioUrl(item, depth + 1);
          if (url) return url;
        }
      }

      if (Array.isArray(obj)) {
        for (const item of obj) {
          const url = checkAudioUrl(item, depth + 1);
          if (url) return url;
        }
      }

      const nestedFields = ['data', 'response', 'result', 'output', 'record', 'task', 'item', 'items', 'tracks'];
      for (const field of nestedFields) {
        if (obj[field]) {
          const url = checkAudioUrl(obj[field], depth + 1);
          if (url) return url;
        }
      }

      return null;
    };

    const checkImageUrl = (obj, depth = 0) => {
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
      return res.status(200).json({ audio_url: immediateUrl, image_url: imageUrl });
    }

    if (taskIds.length === 0) {
      return res.status(400).json({ error: 'No task ID returned', raw: generateData });
    }

    const taskId = taskIds[0];
    for (let attempt = 0; attempt < 60; attempt++) {
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
          console.log('[KIE.AI VERCEL] Poll response:', JSON.stringify(pollData).substring(0, 2000));
          const audioUrl = checkAudioUrl(pollData);
          if (audioUrl) {
            const imageUrl = checkImageUrl(pollData);
            return res.status(200).json({ audio_url: audioUrl, image_url: imageUrl });
          }
          const status = pollData.status || pollData.data?.status || '';
          if (typeof status === 'string' && (status.toUpperCase() === 'FAILED' || status.toUpperCase() === 'ERROR')) {
            break;
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
