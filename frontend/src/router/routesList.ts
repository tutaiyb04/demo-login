import LoginView from "@/views/LoginView.vue";
import TopView from "@/views/TopView.vue";
import UserView from "@/views/UserView.vue";
import type { RouteRecordRaw } from "vue-router";

export const routesList: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      layoutType: "blank",
      requiresAuth: false,
    },
  },
  {
    path: "/wf-tops",
    name: "wf-tops",
    component: TopView,
    meta: {
      title: "トップページ",
      layoutType: "admin",
      requiresAuth: true,
    },
  },
  {
    path: "/users",
    name: "users",
    component: UserView,
    meta: {
      title: "ユーザーマスタ",
      layoutType: "admin",
      requiresAuth: true,
    },
  },
];
