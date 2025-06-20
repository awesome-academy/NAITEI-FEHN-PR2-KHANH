import type {
  DashboardData,
  DashboardStats,
  PopularMovie,
} from "~/interfaces/dashboard";
import type { Booking } from "~/interfaces/booking";
import type { User } from "~/interfaces/user";
import type { Movie } from "~/interfaces/movie";
import axios from "axios";
import { baseURL } from "./useMovies";

export const useDashboard = () => {
  const fetchDashboardData = async (): Promise<DashboardData> => {
    try {
      const [bookingsRes, usersRes, moviesRes] = await Promise.all([
        axios.get<Booking[]>(`${baseURL}/bookings`),
        axios.get<User[]>(`${baseURL}/users`),
        axios.get<Movie[]>(`${baseURL}/movies`),
      ]);

      return {
        bookings: bookingsRes.data,
        users: usersRes.data,
        movies: moviesRes.data,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        bookings: [],
        users: [],
        movies: [],
      };
    }
  };

  const calculateStats = (data: DashboardData): DashboardStats => {
    const confirmedBookings = data.bookings.filter(
      (b) => b.status === "confirmed"
    );

    return {
      totalMovies: data.movies.length,
      totalUsers: data.users.filter((u) => u.role === "user").length,
      totalBookings: confirmedBookings.length,
      totalRevenue: confirmedBookings.reduce(
        (sum, b) => sum + b.totalAmount,
        0
      ),
    };
  };

  const getRecentBookings = (bookings: Booking[], limit = 5): Booking[] => {
    return bookings
      .sort(
        (a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      )
      .slice(0, limit);
  };

  const getPopularMovies = (bookings: Booking[], limit = 6): PopularMovie[] => {
    const movieStats: {
      [key: string]: { bookingCount: number; revenue: number };
    } = {};

    bookings
      .filter((b) => b.status === "confirmed")
      .forEach((booking) => {
        if (!movieStats[booking.movieTitle]) {
          movieStats[booking.movieTitle] = { bookingCount: 0, revenue: 0 };
        }
        movieStats[booking.movieTitle].bookingCount += booking.seats.length;
        movieStats[booking.movieTitle].revenue += booking.totalAmount;
      });

    return Object.entries(movieStats)
      .map(([movieTitle, stats]) => ({
        movieTitle,
        ...stats,
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, limit);
  };

  const getUserInfo = (users: User[], userId: string): User | undefined => {
    return users.find((user) => user.id === userId);
  };

  return {
    fetchDashboardData,
    calculateStats,
    getRecentBookings,
    getPopularMovies,
    getUserInfo,
  };
};
