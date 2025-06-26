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

  const getShowtimes = async (): Promise<Showtime[]> => {
    try {
      const response = await axios.get<Showtime[]>(`${baseURL}/showtimes`);
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

  const createShowtime = async (
    showtimeData: Omit<Showtime, "id">
  ): Promise<{ success: boolean; error?: string; showtime?: Showtime }> => {
    try {
      const newShowtime: Showtime = {
        ...showtimeData,
        id: Date.now().toString(),
      };

      const response = await axios.post<Showtime>(
        `${baseURL}/showtimes`,
        newShowtime
      );
      return { success: true, showtime: response.data };
    } catch (error) {
      return {
        success: false,
        error: "Thêm lịch chiếu thất bại",
      };
    }
  };

  const updateShowtime = async (
    id: string,
    showtimeData: Partial<Showtime>
  ): Promise<{ success: boolean; error?: string; showtime?: Showtime }> => {
    try {
      const response = await axios.put<Showtime>(
        `${baseURL}/showtimes/${id}`,
        showtimeData
      );
      return { success: true, showtime: response.data };
    } catch (error) {
      return {
        success: false,
        error: "Cập nhật lịch chiếu thất bại",
      };
    }
  };

  const deleteShowtime = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await axios.delete(`${baseURL}/showtimes/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Xóa lịch chiếu thất bại",
      };
    }
  };

  return {
    getCinemas,
    getShowtimes,
    getShowtimesByMovie,
    getShowtimesByDate,
    createShowtime,
    updateShowtime,
    deleteShowtime,
  };
};
