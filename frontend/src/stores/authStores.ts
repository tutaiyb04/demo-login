import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/axios";

export type AuthInfo = {
  userId: string;
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
