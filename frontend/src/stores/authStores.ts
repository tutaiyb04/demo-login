// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/axios";

// Định nghĩa interface dựa trên data từ Hexabase
export type AuthInfo = {
  username: string;
  email: string | null;
  fullName: string | null;
  workspaceUserId: string | null;
  itemId: string | null;
  departmentCode: string | null;
  positionCode: string | null;
  roleCode: string | null;
  departmentName?: string | null;
  positionName?: string | null;
  roleName?: string | null;
};

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref<AuthInfo | null>(null);
  const isAuthenticated = ref<boolean>(false);

  // Hàm gọi API /auth/info
  const fetchUserInfo = async () => {
    const response = await api.get<AuthInfo>("/auth/info");
    userInfo.value = response.data;
    isAuthenticated.value = true;
    return response.data;
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
