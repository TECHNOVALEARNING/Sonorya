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
      const systemPrompt = `You are a professional songwriter. Write song lyrics in ${langLabel} language ONLY. Structure them with [Verse 1], [Chorus], [Verse 2], [Bridge], [Outro] tags. Keep lyrics under 2000 characters. Do NOT add any explanations or comments. Write ONLY the lyrics.`;
      
      const userPrompt = `Write song lyrics in ${langLabel} for a ${params.genre} song. 
Occasion: ${params.occasion}. 
Dedicated to: ${name}. 
Story/Context: ${story}. 
Mood: ${params.vibe}. 
Voice: ${params.voiceGender}.
The lyrics must be emotional, personal, and rhyming. Use the person's name "${name}" in the lyrics.`;

      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: 'openai',
          temperature: 0.75
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
${name}, aujourd'hui c'est ton jour de gloire
On écrit ensemble la plus belle des histoires
${story}
Chaque moment avec toi est un trésor de mémoire

[Chorus]
${name}, ${name}, on chante pour toi ce soir
Pour ton ${params.occasion}, que brille chaque étoile
Les rythmes ${params.genre} résonnent dans nos cœurs
${name}, tu mérites tout ce bonheur

[Verse 2]
De Cotonou à Paris, de Dakar à Lomé
Ta lumière traverse les frontières, impossible à oublier
Tes proches, ta famille, tous réunis pour célébrer
Ce jour unique qui ne peut se répéter

[Bridge]
Oh ${name}, reçois cet hymne d'amour
Ces mots gravés en musique pour toujours

[Chorus]
${name}, ${name}, on chante pour toi ce soir
Pour ton ${params.occasion}, que brille chaque étoile
Les rythmes ${params.genre} résonnent dans nos cœurs
${name}, tu mérites tout ce bonheur

[Outro]
${name}... en musique, pour toujours et à jamais`;
    }

    return `[Verse 1]
${name}, today is your day to shine
Every moment with you feels so divine
${story}
Together we celebrate this beautiful time

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
