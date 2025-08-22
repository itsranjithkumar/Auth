// Video type for StatsOverview
export interface StatsOverviewVideo {
  status?: string;
  question_stats?: {
    MCQ?: number;
    Flashcards?: number;
    [key: string]: number | undefined;
  };
}
