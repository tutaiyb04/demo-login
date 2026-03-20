import ApprovedListView from "@/views/acceptance/ApprovedListView.vue";
import ApprovedTasksView from "@/views/acceptance/ApprovedTasksView.vue";
import ApplicationRegisterView from "@/views/apply/ApplicationRegisterView.vue";
import CompleteListView from "@/views/apply/CompleteListView.vue";
import MyTasksView from "@/views/apply/MyTasksView.vue";
import LoginView from "@/views/LoginView.vue";
import ApplyDocListView from "@/views/management/ApplyDocListView.vue";
import CompanyListView from "@/views/management/CompanyListView.vue";
import DepartmentListView from "@/views/management/DepartmentListView.vue";
import PositionListView from "@/views/management/PositionListView.vue";
import UserManagementView from "@/views/management/UserManagementView.vue";
import ApplyRouteListView from "@/views/register/ApplyRouteListView.vue";
import FilesView from "@/views/register/FilesView.vue";
import LatestNewsView from "@/views/register/LatestNewsView.vue";
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
      parentKey: "admin_menu",
    },
  },
  {
    path: "/application-register",
    name: "application-register",
    component: ApplicationRegisterView,
    meta: {
      title: "申請書の新規作成",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "application_menu",
    },
  },
  {
    path: "/my-tasks",
    name: "my-tasks",
    component: MyTasksView,
    meta: {
      title: "申請書一覧",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "application_menu",
    },
  },
  {
    path: "/completed-applications-list",
    name: "completed-applications-list",
    component: CompleteListView,
    meta: {
      title: "完了した申請一覧",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "application_menu",
    },
  },
  {
    path: "/approved-tasks",
    name: "approved-tasks",
    component: ApprovedTasksView,
    meta: {
      title: "申請を承認",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "acceptance_menu",
    },
  },
  {
    path: "/approved-applications-list",
    name: "approved-applications-list",
    component: ApprovedListView,
    meta: {
      title: "承認済み一覧",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "acceptance_menu",
    },
  },
  {
    path: "/application-document-list",
    name: "application-document-list",
    component: ApplyDocListView,
    meta: {
      title: "申請書マスタ一覧",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "admin_menu",
    },
  },
  {
    path: "/company-list",
    name: "company-list",
    component: CompanyListView,
    meta: {
      title: "会社マスタ",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "admin_menu",
    },
  },
  {
    path: "/department-list",
    name: "department-list",
    component: DepartmentListView,
    meta: {
      title: "部署マスタ",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "admin_menu",
    },
  },
  {
    path: "/position-list",
    name: "position-list",
    component: PositionListView,
    meta: {
      title: "役職マスタ",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "admin_menu",
    },
  },
  {
    path: "/user-import-management",
    name: "user-import-management",
    component: UserManagementView,
    meta: {
      title: "ユーザー一括登録",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "admin_menu",
    },
  },
  {
    path: "/files",
    name: "files",
    component: FilesView,
    meta: {
      title: "ファイル一覧・編集",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "register_menu",
    },
  },
  {
    path: "/application-route-list",
    name: "application-route-list",
    component: ApplyRouteListView,
    meta: {
      title: "申請ルート一覧・編集",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "register_menu",
    },
  },
  {
    path: "/latest-news",
    name: "latest-news",
    component: LatestNewsView,
    meta: {
      title: "お知らせ一覧・編集",
      layoutType: "admin",
      requiresAuth: true,
      parentKey: "register_menu",
    },
  },
];
