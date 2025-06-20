export interface DashboardStats {
  totalMovies: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface PopularMovie {
  movieTitle: string;
  bookingCount: number;
  revenue: number;
}

export interface DashboardData {
  bookings: import("./booking").Booking[];
  users: import("./user").User[];
  movies: import("./movie").Movie[];
}
