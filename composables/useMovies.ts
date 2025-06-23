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

  const createMovie = async (
    movieData: Omit<Movie, "id">
  ): Promise<{ success: boolean; error?: string; movie?: Movie }> => {
    try {
      const newMovie: Movie = {
        ...movieData,
        id: Date.now().toString().slice(-6),
      };

      const response = await axios.post<Movie>(`${baseURL}/movies`, newMovie);
      return { success: true, movie: response.data };
    } catch (error) {
      return {
        success: false,
        error: "Thêm phim thất bại",
      };
    }
  };

  const updateMovie = async (
    id: string,
    movieData: Partial<Movie>
  ): Promise<{ success: boolean; error?: string; movie?: Movie }> => {
    try {
      const response = await axios.put<Movie>(
        `${baseURL}/movies/${id}`,
        movieData
      );
      return { success: true, movie: response.data };
    } catch (error) {
      return {
        success: false,
        error: "Cập nhật phim thất bại",
      };
    }
  };

  const deleteMovie = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await axios.delete(`${baseURL}/movies/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Xóa phim thất bại",
      };
    }
  };

  return {
    getMovies,
    getMoviesByStatus,
    getFeaturedMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
  };
};
