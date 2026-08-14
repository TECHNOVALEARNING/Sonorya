import { MusicalStyle, VoiceGender } from '../types/melodia';

export interface KieMusicGenerationResult {
  audioUrl: string;
  previewAudioUrl: string;
  coverUrl: string;
  tempo: number;
  durationSeconds: number;
}

export const KIE_API_KEY = ((import.meta as any).env && (import.meta as any).env.VITE_KIE_API_KEY) ||
  ((import.meta as any).env && (import.meta as any).env.VITE_MUSIC_API_KEY) ||
  'ce70092505bf96765228786f7116f9a4';

export class KieService {
  private static apiKey = KIE_API_KEY;

  public static setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * Generates a unique, high-resolution AI album cover URL tailored to the song title & genre
   */
  public static generateAiCoverUrl(title?: string, genre?: MusicalStyle): string {
    const seed = Math.floor(100000 + Math.random() * 900000);
    const cleanTitle = (title || 'Chanson Sonorya').replace(/[^a-zA-Z0-9\s]/g, '');
    const promptText = `album cover art for music titled ${cleanTitle}, style ${genre || 'Afrobeat'}, vibrant african luxury studio album artwork, 8k resolution, cinematic lighting`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=800&height=800&nologo=true&seed=${seed}`;
  }

  public static async generateMusic(params: {
    lyrics: string;
    genre: MusicalStyle;
    voiceGender: VoiceGender;
    tempo: number;
    title?: string;
  }): Promise<KieMusicGenerationResult> {
    const dynamicAiCoverUrl = this.generateAiCoverUrl(params.title, params.genre);

    // Call server proxy route /api/generate-music to bypass browser CORS
    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: params.lyrics,
          genre: params.genre,
          voiceGender: params.voiceGender,
          title: params.title,
          tempo: params.tempo
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if there's an explicit error from the proxy (like timeout)
        if (data.error) {
          throw new Error(data.error);
        }
        
        const audioUrl = data.audio_url || data.audioUrl || (data.data && (data.data.audio_url || (Array.isArray(data.data) && data.data[0]?.audio_url)));
        if (audioUrl) {
          const imageUrl = data.image_url || data.imageUrl || (data.data && (data.data.image_url || (Array.isArray(data.data) && data.data[0]?.image_url)));
          return {
            audioUrl,
            previewAudioUrl: data.preview_url || audioUrl,
            coverUrl: imageUrl || data.image_url || data.imageUrl || dynamicAiCoverUrl,
            tempo: params.tempo,
            durationSeconds: data.duration || 180
          };
        }
        throw new Error('No audio URL found in response');
      } else {
        throw new Error('API proxy returned an error: ' + response.status);
      }
    } catch (err: any) {
      console.info('Proxy API call info:', err);
      throw new Error(err.message || 'Erreur lors de la génération de la musique. Veuillez réessayer.');
    }
  }
}
