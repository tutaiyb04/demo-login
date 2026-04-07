// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/axios";

// Định nghĩa interface dựa trên data từ Hexabase
export interface UserInfo {
  id?: string;
  email?: string;
  username?: string;
  DepartmentCode?: string;
  PositionCode?: string;
  RoleCode?: string;
  // Thêm các trường khác nếu cần
}

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref<UserInfo | null>(null);
  const isAuthenticated = ref<boolean>(false);

  // Hàm gọi API /auth/info
  const fetchUserInfo = async () => {
    try {
      // Axios interceptor đã tự động đính kèm token vào header
      const response = await api.get("/auth/info");
      userInfo.value = response.data;
      isAuthenticated.value = true;
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      userInfo.value = null;
      isAuthenticated.value = false;
      throw error;
    }
  };

  const clearAuth = () => {
    userInfo.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("access_token");
  };

  return {
    userInfo,
    isAuthenticated,
    fetchUserInfo,
    clearAuth,
  };
});
