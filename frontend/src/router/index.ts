import { createRouter, createWebHistory } from "vue-router";

import { routesList } from "./routesList";
import { useLoading } from "@/composables/useLoading";
import { useAuthStore } from "@/stores/authStores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routesList,
});

router.beforeEach(async (to, from, next) => {
  const { showLoading } = useLoading();
  showLoading();

  const token = localStorage.getItem("access_token");
  const authStore = useAuthStore();

  if (token && !authStore.user) {
    try {
      await authStore.fetchUserProfile(); // Khôi phục data từ DB
    } catch (error) {
      // Token sai hoặc hết hạn -> Xóa token, bắt login lại
      authStore.clearAuth();
      return next({ name: "login" });
    }
  }

  const isAuthenticated = !!authStore.user;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "login" && isAuthenticated) {
    next({ name: "wf-tops" });
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
