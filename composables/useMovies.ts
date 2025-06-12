import type { Movie } from "~/interfaces/movie";

export const useMovies = () => {
  const baseURL = "http://localhost:3001";
  const getMovies = async (): Promise<Movie[]> => {
    try {
      const data = await $fetch<Movie[]>(`${baseURL}/movies`);
      return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  const getMoviesByStatus = async (
    status: Movie["status"]
  ): Promise<Movie[]> => {
    try {
      const data = await $fetch<Movie[]>(`${baseURL}/movies?status=${status}`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  const getFeaturedMovies = async (): Promise<Movie[]> => {
    try {
      const data = await $fetch<Movie[]>(`${baseURL}/movies?featured=true`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return [];
    }
  };

  const getMovieById = async (id: number): Promise<Movie | null> => {
    try {
      const data = await $fetch<Movie>(`${baseURL}/movies/${id}`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  };

  return {
    getMovies,
    getMoviesByStatus,
    getFeaturedMovies,
    getMovieById,
  };
};
