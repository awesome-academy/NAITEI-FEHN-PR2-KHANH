/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Booking } from "~/interfaces/booking";
import axios from "axios";
import { baseURL } from "./useMovies";

export const useBooking = () => {
  const getBookingsByShowtime = async (
    showtimeId: string
  ): Promise<Booking[]> => {
    try {
      const response = await axios.get<Booking[]>(`${baseURL}/bookings`, {
        params: { showtimeId },
      });
      return response.data;
    } catch (error: any) {
      return [];
    }
  };

  const createBooking = async (
    booking: Omit<Booking, "id" | "bookingDate">
  ): Promise<{ success: boolean; error?: string; booking?: Booking }> => {
    try {
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        bookingDate: new Date().toISOString(),
      };

      const response = await axios.post<Booking>(
        `${baseURL}/bookings`,
        newBooking
      );
      return { success: true, booking: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: "Đặt vé thất bại",
      };
    }
  };

  const getUserBookings = async (userId: string): Promise<Booking[]> => {
    try {
      const response = await axios.get<Booking[]>(`${baseURL}/bookings`, {
        params: { userId },
      });
      return response.data.sort(
        (a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
    } catch (error: any) {
      return [];
    }
  };

  return {
    getBookingsByShowtime,
    createBooking,
    getUserBookings,
  };
};
