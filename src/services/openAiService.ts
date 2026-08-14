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

    // Fallback: If AI fails, we delegate the lyrics generation to Kie API natively
    console.log('[LYRICS] Using Kie API native lyrics generation fallback');
    const autoPrompt = `Une chanson pour ${name}. ${story}. Style: ${params.genre}. Ambiance: ${params.vibe}.`;
    return `[KIE_AUTO] ${autoPrompt.substring(0, 150)}`;
  }
}
