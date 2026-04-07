import { createRouter, createWebHistory } from "vue-router";

import { routesList } from "./routesList";
import { useLoading } from "@/composables/useLoading";
import { useAuthStore } from "@/stores/authStores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routesList,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("access_token");
  const authStore = useAuthStore();

  // Nếu có token nhưng chưa có thông tin user trong store (ví dụ: vừa F5)
  if (token && !authStore.isAuthenticated) {
    try {
      await authStore.fetchUserInfo();
    } catch (error) {
      // Token hết hạn hoặc không hợp lệ -> Xóa token và bắt login lại
      authStore.clearAuth();
      if (to.path !== "/login") {
        return next("/login");
      }
    }
  }

  // Logic check guard thông thường
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

router.afterEach(() => {
  const { hideLoading } = useLoading();
  setTimeout(() => {
    hideLoading();
  }, 1000);
});

export default router;
