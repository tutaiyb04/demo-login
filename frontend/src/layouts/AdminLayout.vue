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
    selectedKeys.value = [newPath];

    const parentKey = route.meta.parentKey as string;
    if (parentKey && !openKeys.value.includes(parentKey)) {
      openKeys.value.push(parentKey);
    }
  },
  { immediate: true },
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

          <a-sub-menu key="application_menu">
            <template #title>申請する</template>
            <a-menu-item
              key="/application-register"
              @click="navigateTo('/application-register')"
              >申請書の新規作成</a-menu-item
            >
            <a-menu-item key="/my-tasks" @click="navigateTo('/my-tasks')"
              >申請書一覧</a-menu-item
            >
            <a-menu-item
              key="/completed-applications-list"
              @click="navigateTo('/completed-applications-list')"
              >完了した申請一覧</a-menu-item
            >
          </a-sub-menu>

          <a-sub-menu key="acceptance_menu">
            <template #title>承認する</template>
            <a-menu-item
              key="/approved-tasks"
              @click="navigateTo('/approved-tasks')"
              >申請を承認</a-menu-item
            >
            <a-menu-item
              key="/approved-applications-list"
              @click="navigateTo('/approved-applications-list')"
              >承認済み一覧</a-menu-item
            >
          </a-sub-menu>

          <a-sub-menu key="admin_menu">
            <template #title>管理者機能</template>
            <a-menu-item
              key="/application-document-list"
              @click="navigateTo('/application-document-list')"
              >申請書マスタ一覧</a-menu-item
            >
            <a-menu-item
              key="/company-list"
              @click="navigateTo('/company-list')"
              >会社マスタ</a-menu-item
            >
            <a-menu-item
              key="/department-list"
              @click="navigateTo('/department-list')"
              >部署マスタ</a-menu-item
            >
            <a-menu-item
              key="/position-list"
              @click="navigateTo('/position-list')"
              >役職マスタ</a-menu-item
            >
            <a-menu-item key="/users" @click="navigateTo('/users')">
              ユーザーマスタ
            </a-menu-item>
            <a-menu-item
              key="/user-import-management"
              @click="navigateTo('/user-import-management')"
              >ユーザー一括登録</a-menu-item
            >
          </a-sub-menu>

          <a-sub-menu key="register_menu">
            <template #title>登録</template>
            <a-menu-item key="/files" @click="navigateTo('/files')"
              >ファイル一覧・編集</a-menu-item
            >
            <a-menu-item
              key="/application-route-list"
              @click="navigateTo('/application-route-list')"
              >申請ルート一覧・編集</a-menu-item
            >
            <a-menu-item key="/latest-news" @click="navigateTo('/latest-news')"
              >お知らせ一覧・編集</a-menu-item
            >
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
                class="font-medium !text-gray-400 hover:!text-gray-400 hover:!bg-white"
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
