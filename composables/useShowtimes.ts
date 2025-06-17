/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Cinema, Showtime } from "~/interfaces/cinema";
import axios from "axios";
import { baseURL } from "./useMovies";

export const useShowtimes = () => {
  const getCinemas = async (): Promise<Cinema[]> => {
    try {
      const response = await axios.get<Cinema[]>(`${baseURL}/cinemas`);
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getShowtimesByMovie = async (
    movieId: string | number
  ): Promise<Showtime[]> => {
    try {
      const response = await axios.get<Showtime[]>(`${baseURL}/showtimes`, {
        params: { movieId: movieId.toString() },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const getShowtimesByDate = async (
    movieId: string | number,
    date: string
  ): Promise<Showtime[]> => {
    try {
      const response = await axios.get<Showtime[]>(`${baseURL}/showtimes`, {
        params: {
          movieId: movieId.toString(),
          date,
        },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  };

  return {
    getCinemas,
    getShowtimesByMovie,
    getShowtimesByDate,
  };
};
