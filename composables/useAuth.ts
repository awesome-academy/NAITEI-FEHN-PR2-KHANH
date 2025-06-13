/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, reactive, watch } from "vue";
import type { User } from "~/interfaces/user";
import axios from "axios";
import { baseURL } from "./useMovies";

const state = reactive({
  currentUser: null as User | null,
  isAuthenticated: false,
  isLoading: true,
});

const methods = {
  async login(email: string, password: string) {
    try {
      const response = await axios.get<User[]>(`${baseURL}/users`, {
        params: { email },
      });
      const users = response.data;
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        throw new Error("Email hoặc mật khẩu không chính xác");
      }
      const { password: _, ...safeUser } = user;
      state.currentUser = safeUser as User;
      state.isAuthenticated = true;
      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(safeUser));
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "Đăng nhập thất bại",
      };
    }
  },

  async register(userData: Partial<User>) {
    try {
      if (!userData.email || !userData.fullName || !userData.password) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }
      const checkResponse = await axios.get<User[]>(`${baseURL}/users`, {
        params: { email: userData.email },
      });
      const existingUsers = checkResponse.data;
      if (existingUsers.length > 0) {
        throw new Error("Email đã được đăng ký");
      }
      const newUser = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber ?? "",
        avatar: "/image.png",
        role: "user",
        createdAt: new Date().toISOString(),
      } as User;
      await axios.post<User>(`${baseURL}/users`, newUser);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.message ?? error.message ?? "Đăng ký thất bại",
      };
    }
  },

  logout() {
    state.currentUser = null;
    state.isAuthenticated = false;
    if (import.meta.client) {
      localStorage.removeItem("user");
    }
    return { success: true, message: "Đăng xuất thành công" };
  },

  init() {
    if (import.meta.client) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          state.currentUser = JSON.parse(storedUser);
          state.isAuthenticated = true;
        }
      } finally {
        state.isLoading = false;
      }
    } else {
      state.isLoading = false;
    }
  },
};

if (import.meta.client) {
  methods.init();
}

const currentUser = ref(state.currentUser);
const isAuthenticated = ref(state.isAuthenticated);
const isLoading = ref(state.isLoading);

watch(
  () => state.currentUser,
  (newValue) => {
    currentUser.value = newValue;
  },
  { deep: true }
);

watch(
  () => state.isAuthenticated,
  (newValue) => {
    isAuthenticated.value = newValue;
  }
);

watch(
  () => state.isLoading,
  (newValue) => {
    isLoading.value = newValue;
  }
);

export function useAuth() {
  return {
    currentUser,
    isAuthenticated,
    isLoading,

    ...methods,
  };
}
