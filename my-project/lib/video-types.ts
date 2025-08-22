// Type definitions for videoData normalization
export interface VideoQuestion {
  question: string | null;
  options?: string[];
  correct_answer?: string | null;
  explanation?: string | null;
  difficulty?: string | null;
  error?: string | null;
}

export interface VideoFlashcard {
  front: string | null;
  back: string | null;
  error?: string | null;
}
