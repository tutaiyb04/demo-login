<script setup lang="ts">
import { SearchOutlined } from "@ant-design/icons-vue";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search"): void;
}>();
</script>

<template>
  <div class="flex mb-6">
    <a-input
      :value="modelValue"
      placeholder="検索ワードを入力してください"
      class="flex-1 h-[44px] !text-[1.6rem] !rounded-r-none"
      @update:value="emit('update:modelValue', $event)"
      @pressEnter="emit('search')"
    />
    <a-button
      type="primary"
      class="w-[100px] !h-[44px] p-0 flex items-center justify-center !text-[1.6rem] search-btn shadow-none !rounded-l-none"
      @click="emit('search')"
    >
      <div class="flex items-center justify-center gap-1.5 mt-[2px]">
        <SearchOutlined class="text-[2rem] flex items-center" />
        <span class="leading-none flex items-center">検索</span>
      </div>
    </a-button>
  </div>
</template>

<style scoped>
.search-btn {
  background-color: #0072c6 !important;
  border-color: #0072c6 !important;
}
:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  z-index: 1;
}
</style>
