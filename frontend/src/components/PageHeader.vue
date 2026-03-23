<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const isTopPage = computed(() => route.name === "wf-tops");
const pageTitle = computed(() => route.meta.title as string);
const pageDescription = computed(() => route.meta.description as string);
</script>

<template>
  <div class="bg-white px-6 py-4 border-b border-gray-200 shrink-0">
    <a-breadcrumb separator="/">
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

    <div
      v-if="!isTopPage && !route.meta.hidePageHeader"
      class="mt-10 mb-2 pl-4"
    >
      <h1 class="text-[2.2rem] !font-bold text-gray-800 mb-1">
        {{ pageTitle }}
      </h1>
      <p v-if="pageDescription" class="text-[1.4rem] text-[#9d9d9d] m-0">
        {{ pageDescription }}
      </p>
    </div>
  </div>
</template>
