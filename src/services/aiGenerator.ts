import { Occasion, Genre, Order } from '../types/melodia';

export interface AIGeneratedSong {
  lyrics: string;
  coverUrl: string;
  audioUrl: string;
  bpm: number;
}

export const generateAILyrics = (
  occasion: Occasion,
  recipientName: string,
  story: string,
  genre: Genre
): string => {
  const name = recipientName.trim() || 'Destinataire';
  const cleanStory = story.trim() || 'Une histoire unique et spéciale';

  return `[Couplet 1 - ${genre}]
${name}, ce morceau a été composé tout particulièrement pour toi.
${cleanStory}
Chaque note et chaque mot célèbrent ton histoire avec émotion.

[Refrain]
Pour ton ${occasion}, que cette chanson résonne dans tous les cœurs !
Sous le rythme ${genre}, nous fêtons cette journée mémorable.

[Couplet 2]
Que la joie, l'harmonie et l'amour t'accompagnent jour après jour.
De la part de tous tes proches, reçois cette dédicace musicale.

[Outro]
${name}... Gravé en musique pour toujours.`;
};

export const getCoverArtForGenreAndOccasion = (genre: Genre, occasion: Occasion, recipientName?: string): string => {
  const seed = Math.floor(100000 + Math.random() * 900000);
  const promptText = `album cover art for ${occasion} song for ${recipientName || 'friend'}, musical style ${genre}, vibrant studio production album artwork, 8k resolution`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=800&height=800&nologo=true&seed=${seed}`;
};

export const generateAISong = async (
  draft: Partial<Order>
): Promise<AIGeneratedSong> => {
  const occasion = draft.occasion || 'Anniversaire';
  const recipientName = draft.recipientName || 'Mon Ami';
  const story = draft.story || '';
  const genre = draft.genre || 'Afrobeat';

  const lyrics = generateAILyrics(occasion, recipientName, story, genre);
  const coverUrl = getCoverArtForGenreAndOccasion(genre, occasion, recipientName);

  // In production, this calls Kie.ai Audio API / Suno AI endpoint:
  // POST /api/generate-music { prompt: lyrics, style: genre }
  const audioUrl = `https://cdn.sonorya.technova.app/ai-tracks/${genre.toLowerCase()}-${Math.floor(Math.random() * 9000 + 1000)}.mp3`;

  return {
    lyrics,
    coverUrl,
    audioUrl,
    bpm: genre === 'Highlife' ? 125 : genre === 'Afrobeat' ? 118 : 100
  };
};
