/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Movie } from "~/interfaces/movie";
import axios from "axios";

export const baseURL = "http://localhost:3001";

export const useMovies = () => {
  const getMovies = async (): Promise<Movie[]> => {
    try {
      const response = await axios.get<Movie[]>(`${baseURL}/movies`);
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getMoviesByStatus = async (
    status: Movie["status"]
  ): Promise<Movie[]> => {
    try {
      const response = await axios.get<Movie[]>(`${baseURL}/movies`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getFeaturedMovies = async (): Promise<Movie[]> => {
    try {
      const response = await axios.get<Movie[]>(`${baseURL}/movies`, {
        params: { featured: true },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getMovieById = async (id: number): Promise<Movie | null> => {
    try {
      const response = await axios.get<Movie>(`${baseURL}/movies/${id}`);
      return response.data;
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
