<script setup lang="ts">
import api from "@/utils/axios";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loggedInUser = ref<string>("");

onMounted(() => {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    const userObj = JSON.parse(user);
    loggedInUser.value = userObj.username;
  } else {
    loggedInUser.value = "Guest";
  }
});

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    message.success("ログアウトに成功しました。");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("loggedInUser");

    router.push("/login");
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>
<template>
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
</template>
