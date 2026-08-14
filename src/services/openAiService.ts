import { Occasion, MusicalStyle, VoiceGender, SongLanguage, SongVibe } from '../types/melodia';

export class OpenAiService {
  public static async generateLyrics(params: {
    occasion: Occasion;
    recipientName: string;
    story: string;
    genre: MusicalStyle;
    voiceGender: VoiceGender;
    language: SongLanguage;
    vibe: SongVibe;
  }): Promise<string> {
    const name = params.recipientName.trim() || 'Destinataire';
    const story = params.story.trim() || 'Une personne formidable et pleine de joie';
    const lang = params.language || 'Français';
    const langLabel = lang === 'Anglais' ? 'English' : lang === 'Français' ? 'French' : lang;

    // Use Pollinations AI text generation (free, no API key needed)
    try {
      const systemPrompt = `You are a professional songwriter. Write song lyrics in ${langLabel} language ONLY. Structure them with [Verse 1], [Chorus], [Verse 2], [Bridge], [Chorus], [Outro] tags. Keep lyrics between 1000 and 2000 characters. Do NOT add any explanations or comments. Write ONLY the lyrics. Ensure the vocabulary is rich, poetic, and creative.`;
      
      const userPrompt = `Write rich, poetic, and meaningful song lyrics in ${langLabel} for a ${params.genre} song. 
Occasion: ${params.occasion}. 
Dedicated to: ${name}. 
Story/Context: ${story}. 
Mood: ${params.vibe}. 
Voice: ${params.voiceGender}.
The lyrics must be highly emotional, personal, and well-structured with at least two verses, a bridge, and a catchy chorus. Use the person's name "${name}" in the lyrics. Be very creative and avoid generic clichés.`;

      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: 'openai',
          temperature: 0.85
        })
      });

      if (response.ok) {
        const text = await response.text();
        // Clean up: remove markdown code blocks if present
        let cleaned = text.trim();
        cleaned = cleaned.replace(/```[\s\S]*?```/g, '').trim();
        cleaned = cleaned.replace(/^```\w*\n?/gm, '').replace(/```$/gm, '').trim();
        
        if (cleaned.length > 100 && (cleaned.includes('[') || cleaned.includes('Verse') || cleaned.includes('Couplet') || cleaned.includes('Refrain') || cleaned.includes('Chorus'))) {
          // Truncate to 2500 chars max for Kie.ai V4 compatibility
          if (cleaned.length > 2500) {
            cleaned = cleaned.substring(0, 2500);
            const lastSection = cleaned.lastIndexOf('\n[');
            if (lastSection > 500) {
              cleaned = cleaned.substring(0, lastSection);
            }
          }
          console.log('[LYRICS] ✅ AI-generated lyrics length:', cleaned.length);
          return cleaned;
        }
      }
    } catch (e) {
      console.info('[LYRICS] AI generation notice:', e);
    }

    // Fallback: high-quality personalized template lyrics
    console.log('[LYRICS] Using personalized fallback template');
    const isFrench = lang === 'Français' || lang === 'Fon' || lang === 'Lingala' || lang === 'Wolof';

    if (isFrench) {
      return `[Verse 1]
${name}, aujourd'hui la vie célèbre ton nom
Nos cœurs s'accordent tous sur le même diapason
${story}
Dans chaque sourire se cache une nouvelle chanson

[Chorus]
${name}, oh ${name}, c'est ton moment d'éclat
Pour ton ${params.occasion}, le monde entier s'ouvre à toi
Laisse la magie opérer, laisse-toi porter par nos voix
${name}, tu mérites l'amour qui coule sous ce toit

[Verse 2]
Les souvenirs que l'on tisse ne s'effaceront jamais
Même les tempêtes lointaines se sont mises à chanter
C'est ta présence unique qui vient tout illuminer
Une étincelle précieuse que rien ne peut remplacer

[Bridge]
Quand le rythme s'accélère et que la nuit descend
On gardera cette mélodie à travers l'océan
Que le meilleur reste à venir, à partir de maintenant

[Chorus]
${name}, oh ${name}, c'est ton moment d'éclat
Pour ton ${params.occasion}, le monde entier s'ouvre à toi
Laisse la magie opérer, laisse-toi porter par nos voix
${name}, tu mérites l'amour qui coule sous ce toit

[Outro]
Cette chanson est pour toi...
Garde-la précieusement, ${name}...
Aujourd'hui, demain, et pour toujours...`;
    }

    return `[Verse 1]
${name}, today the world celebrates your light
Every moment we share shines incredibly bright
${story}
Together we stand on this beautiful night

[Chorus]
${name}, ${name}, we sing this song for you
For your ${params.occasion}, may all your dreams come true
The rhythm of ${params.genre} beats within our hearts
${name}, you deserve the very best from the start

[Verse 2]
From every corner of the world they came to say
That you light up the room in your own special way
Your loved ones gather here to lift you high
A celebration under the open sky

[Bridge]
Oh ${name}, receive this hymn of love
These words forever etched in melodies above

[Chorus]
${name}, ${name}, we sing this song for you
For your ${params.occasion}, may all your dreams come true
The rhythm of ${params.genre} beats within our hearts
${name}, you deserve the very best from the start

[Outro]
${name}... in music, forever and always`;
  }
}
