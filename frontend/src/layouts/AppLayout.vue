<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "./AdminLayout.vue";
import BlankLayout from "./BlankLayout.vue";
import GlobalLoading from "@/components/GlobalLoading.vue";

const route = useRoute();

const layout = computed(() => {
  const layoutType = route.meta.layoutType;

  if (layoutType === "admin") {
    return AdminLayout;
  }
  if (layoutType === "blank") {
    return BlankLayout;
  }
});
</script>

<template>
  <GlobalLoading />

  <component :is="layout">
    <slot />
  </component>
</template>
