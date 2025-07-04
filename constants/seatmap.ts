export const SEAT_MAP = {
  rows: {
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    C: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    D: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    E: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    F: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    G: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    H: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
};

export const TOTAL_SEATS = Object.values(SEAT_MAP.rows).reduce(
  (total, row) => total + row.length,
  0
);
