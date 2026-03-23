<script setup lang="ts">
import { computed } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue"; // Bổ sung import icon

const props = defineProps<{
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "search"): void;
}>();

const localQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit("update:searchQuery", val),
});

const isSearchDisabled = computed<boolean>(() => {
  return localQuery.value.trim().length === 0;
});

const handleSearch = () => {
  if (isSearchDisabled.value) return;
  emit("search");
};
</script>

<template>
  <div class="flex justify-between items-start mb-6">
    <h2 class="text-[1.6rem] !font-bold text-[#333333] m-0">ユーザー検索</h2>
  </div>

  <div class="flex mb-4">
    <a-input
      v-model:value="localQuery"
      placeholder="会社コードを入力してください"
      class="flex-1 h-[44px] !text-[1.6rem] !rounded-r-none"
      @pressEnter="handleSearch"
    />

    <a-button
      type="primary"
      class="w-[100px] !h-[44px] p-0 flex items-center justify-center !text-[1.6rem] search-btn shadow-none !rounded-l-none"
      :disabled="isSearchDisabled"
      @click="handleSearch"
    >
      <div class="flex items-center justify-center gap-1.5 mt-[2px]">
        <SearchOutlined class="text-[2rem] flex items-center" />
        <span class="leading-none flex items-center">検索</span>
      </div>
    </a-button>
  </div>
</template>

<style scoped>
.search-btn:disabled {
  background-color: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.25) !important;
}
.search-btn:not(:disabled) {
  background-color: #0072c6 !important;
  border-color: #0072c6 !important;
}

/* Đảm bảo khi focus ô input không bị viền đè lên nút */
:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  z-index: 1;
}
</style>
