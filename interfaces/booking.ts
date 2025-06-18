export interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "occupied" | "selected";
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  cinemaId: string;
  showtimeId: string;
  movieTitle: string;
  cinemaName: string;
  date: string;
  time: string;
  format: string;
  seats: string[];
  totalAmount: number;
  status: "confirmed";
  bookingDate: string;
}
