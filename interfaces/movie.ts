export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  duration: number;
  releaseDate: string;
  genre: string[];
  director: string;
  cast: string[];
  rating: number;
  poster: string;
  backdrop: string;
  trailer?: string;
  status: "now-showing" | "coming-soon" | "ended";
  language: string;
  ageRating: string;
  featured?: boolean;
}
