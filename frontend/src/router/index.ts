import { createRouter, createWebHistory } from "vue-router";

import { routesList } from "./routesList";
import { useLoading } from "@/composables/useLoading";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routesList,
});

router.beforeEach((to, from, next) => {
  const { showLoading } = useLoading();
  showLoading();

  const isAuthenticated = localStorage.getItem("loggedInUser");
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "login" && isAuthenticated) {
    next({ name: "top" });
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
