import type { Movie } from "~/interfaces/movie";

const getStatusText = (status: Movie["status"]) => {
  switch (status) {
    case "now-showing":
      return "Đang chiếu";
    case "coming-soon":
      return "Sắp chiếu";
    case "ended":
      return "Đã kết thúc";
    default:
      return "";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export { getStatusText, formatDate };
