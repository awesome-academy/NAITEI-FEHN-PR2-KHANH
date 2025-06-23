import type { ShowtimeFormat } from "~/interfaces/cinema";

export const QUICK_TIMES = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
  "21:00",
  "22:30",
] as const;

export const FORMAT_OPTIONS: ShowtimeFormat[] = [
  { type: "2D", name: "2D Phụ đề", price: 85000 },
  { type: "3D", name: "3D Phụ đề", price: 120000 },
  { type: "IMAX", name: "IMAX 2D", price: 180000 },
  { type: "4DX", name: "4DX", price: 250000 },
  { type: "ScreenX", name: "ScreenX", price: 200000 },
] as const;

export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_VISIBLE_TIMES: 3,
} as const;
