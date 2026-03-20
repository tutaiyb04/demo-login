<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const loggedInUser = ref<string>("");
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

const isTopPage = computed(() => route.name === "wf-tops");

const pageTitle = computed(() => route.meta.title as string);

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/wf-tops") {
      selectedKeys.value = [];
    } else if (newPath === "/users") {
      selectedKeys.value = [];
    }
  },
);

onMounted(() => {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    loggedInUser.value = user;
  } else {
    loggedInUser.value = "TAITTMANAGER";
  }
});

const handleLogout = () => {
  localStorage.removeItem("loggedInUser");
  router.push("/login");
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <a-layout class="h-screen overflow-hidden">
    <a-layout-header
      class="flex items-center justify-between !px-6 !bg-[#262626] !h-[32px]"
    >
      <div
        class="text-white !font-bold text-[1.6rem] cursor-pointer"
        @click="navigateTo('/wf-tops')"
      >
        ACF Baas Workflow
      </div>

      <div class="flex items-center text-white text-[1.4rem] h-full gap-11">
        <div
          class="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
        >
          <div
            class="w-[20px] h-[20px] rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-user-circle"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path
                d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"
              />
            </svg>
          </div>
          <span>{{ loggedInUser }}</span>
        </div>

        <div
          class="flex items-center gap-3 cursor-pointer hover:text-gray-300 transition-colors"
          @click="handleLogout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
            />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </svg>
          <span>ログアウト</span>
        </div>
      </div>
    </a-layout-header>

    <a-layout>
      <a-layout-sider width="220" class="!bg-[#33445c]">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          theme="dark"
          mode="inline"
          class="!bg-[#33445c] border-r-0 pb-6"
        >
          <template #expandIcon="{ isOpen }">
            <svg
              v-if="!isOpen"
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1V13M1 7H13"
                stroke="currentColor"
                stroke-opacity="1"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 7H13"
                stroke="currentColor"
                stroke-opacity="1"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>

          <a-sub-menu key="sub1">
            <template #title>申請する</template>
            <a-menu-item key="1">申請書の新規作成</a-menu-item>
            <a-menu-item key="2">申請書一覧</a-menu-item>
            <a-menu-item key="3">完了した申請一覧</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub2">
            <template #title>承認する</template>
            <a-menu-item key="4">申請を承認</a-menu-item>
            <a-menu-item key="5">承認済み一覧</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub3">
            <template #title>管理者機能</template>
            <a-menu-item key="6">申請書マスタ一覧</a-menu-item>
            <a-menu-item key="8">会社マスタ</a-menu-item>
            <a-menu-item key="9">部署マスタ</a-menu-item>
            <a-menu-item key="10">役職マスタ</a-menu-item>
            <a-menu-item key="11" @click="navigateTo('/users')">
              ユーザーマスタ
            </a-menu-item>
            <a-menu-item key="12">ユーザー一括登録</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="sub4">
            <template #title>登録</template>
            <a-menu-item key="13">ファイル一覧・編集</a-menu-item>
            <a-menu-item key="14">申請ルート一覧・編集</a-menu-item>
            <a-menu-item key="15">お知らせ一覧・編集</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <a-layout-content
        class="!bg-[#f0f2f5] flex flex-col h-full overflow-hidden"
      >
        <div class="bg-white px-6 py-3 border-b border-gray-200 shrink-0">
          <a-breadcrumb separator=">">
            <a-breadcrumb-item>
              <RouterLink
                v-if="!isTopPage"
                to="/wf-tops"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                トップページ
              </RouterLink>
              <span v-else class="text-black">トップページ</span>
            </a-breadcrumb-item>

            <a-breadcrumb-item v-if="!isTopPage && pageTitle">
              <span class="text-black">{{ pageTitle }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="overflow-y-auto flex-1 p-6">
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
:deep(.ant-menu-sub.ant-menu-inline) {
  background-color: #33445c !important;
}

:deep(.ant-menu-submenu) {
  position: relative;
  padding-bottom: 12px !important;
}

:deep(.ant-menu-submenu::after) {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background-color: #ffffff;
}

:deep(.ant-menu-submenu:last-child::after) {
  display: none;
}

:deep(.ant-menu-submenu-title) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  height: 48px !important;
  line-height: 48px !important;
  padding-left: 20px !important;
  padding-right: 20px !important;
}

:deep(.ant-menu-item) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  height: 40px !important;
  line-height: 40px !important;
  width: 100% !important;
  border-radius: 0 !important;
  padding-left: 30px !important;
}

:deep(.ant-menu-submenu-title .ant-menu-title-content) {
  font-size: 1.6rem !important;
}

:deep(.ant-menu-item .ant-menu-title-content) {
  font-size: 1.4rem !important;
}

:deep(.ant-menu-item),
:deep(.ant-menu-submenu-title) {
  color: rgba(255, 255, 255, 0.7) !important;
  transition: color 0.3s ease;
}

:deep(.ant-menu-item-selected) {
  background-color: transparent !important;
  color: #ffffff !important;
}

:deep(.ant-menu-item:hover),
:deep(.ant-menu-submenu-title:hover) {
  background-color: transparent !important;
  color: #ffffff !important;
}

:deep(.ant-menu-submenu-title:hover .ant-menu-submenu-expand-icon) {
  color: #ffffff !important;
}

:deep(.ant-menu-submenu-expand-icon) {
  right: 30px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  display: flex;
  color: rgba(255, 255, 255, 0.7) !important;
  align-items: center;
  justify-content: center;
  width: 16px !important;
  height: 16px !important;
  transition: color 0.3s ease;
}

:deep(.ant-menu-submenu-expand-icon:hover) {
  background-color: transparent !important;
  color: #ffffff !important;
}
</style>
