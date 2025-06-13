export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  avatar: string;
  phoneNumber: string;
  role: "admin" | "user";
  createdAt: string;
}
