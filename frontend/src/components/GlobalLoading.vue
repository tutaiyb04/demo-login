<script setup lang="ts">
import { useLoading } from "@/composables/useLoading";

const { isLoading } = useLoading();
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-[2px]"
  >
    <a-spin size="medium" tip="Loading..." />
  </div>
</template>

<style scoped>
:deep(.ant-spin-text) {
  color: #2c7ebd !important;
  font-weight: bold;
  margin-top: 12px;
}

:deep(.ant-spin-dot-item) {
  background-color: #2c7ebd !important;
}
</style>
