<script setup lang="ts">
import type { FilterStatus } from "@/types/UserImport";

defineProps<{
  modelValue: FilterStatus;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterStatus): void;
}>();

const handleFilterChange = (filterValue: FilterStatus) => {
  emit("update:modelValue", filterValue);
};
</script>
<template>
  <div class="flex gap-6 mb-8 text-[1.4rem]">
    <a-checkbox
      :checked="modelValue === 'all'"
      @change="handleFilterChange('all')"
      >すべて</a-checkbox
    >
    <a-checkbox
      :checked="modelValue === 'pending'"
      @change="handleFilterChange('pending')"
      >未実施</a-checkbox
    >
    <a-checkbox
      :checked="modelValue === 'registering'"
      @change="handleFilterChange('registering')"
      >登録中</a-checkbox
    >
    <a-checkbox
      :checked="modelValue === 'success'"
      @change="handleFilterChange('success')"
      >成功</a-checkbox
    >
    <a-checkbox
      :checked="modelValue === 'failed'"
      @change="handleFilterChange('failed')"
      >失敗</a-checkbox
    >
  </div>
</template>
<style scoped>
:deep(.ant-checkbox-wrapper) {
  font-size: 1.4rem;
  color: #333;
}
</style>
