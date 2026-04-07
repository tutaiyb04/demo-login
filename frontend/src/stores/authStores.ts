// frontend/src/stores/authStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/axios";

export const useAuthStore = defineStore("auth", () => {
  // 1. STATE: Mặc định là null (không lấy từ localStorage)
  const user = ref<any>(null);

  // 2. ACTION: Lưu thẳng data vào RAM khi Login thành công
  const setUser = (userData: any) => {
    user.value = userData;
  };

  // 3. ACTION: Gọi API lấy lại data khi bị F5 tải lại trang
  const fetchUserProfile = async () => {
    if (user.value) return user.value; // Có rồi thì thôi
    try {
      const response = await api.get("/users/me"); // Gọi API vừa tạo ở Bước 1
      user.value = response.data;
      return user.value;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      clearAuth();
      throw error;
    }
  };

  const clearAuth = () => {
    user.value = null;
    localStorage.removeItem("access_token");
  };

  return { user, setUser, fetchUserProfile, clearAuth };
});
