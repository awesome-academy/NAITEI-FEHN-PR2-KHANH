export interface Cinema {
  id: string;
  name: string;
  address: string;
  phone?: string;
  facilities: string[];
}

export interface ShowtimeFormat {
  type: "2D" | "3D" | "IMAX" | "4DX" | "ScreenX";
  name: string;
  price: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  times: string[];
  format: ShowtimeFormat;
  availableSeats: number;
  totalSeats: number;
}
