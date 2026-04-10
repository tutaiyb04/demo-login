<script setup lang="ts">
import PreviewActions from "@/components/userImportPreview/PreviewActions.vue";
import PreviewSummary from "@/components/userImportPreview/PreviewSummary.vue";
import PreviewTable from "@/components/userImportPreview/PreviewTable.vue";
import type { PreviewRecord } from "@/types/UserImport";
import { ref, computed } from "vue";

const fileName = ref("importuser -OK -1 - ShiftJs 2.csv");

const previewData = ref<PreviewRecord[]>([
  {
    id: 1,
    actionType: "削除",
    userId: "MIZUKI01",
    firstName: "田中",
    kanaFirstName: "タナカ",
    lastName: "一郎",
    kanaLastName: "イチロウ",
    userCategory: "管理者",
    deptCode: "ACFD001",
    roleCode: "ACFP001",
    authId: "ROLENEW",
    email: "na@kaopiz.com",
    startDate: "2026/04/09",
    staffCode: "S001",
    remarks: "-",
  },
  {
    id: 2,
    actionType: "更新",
    userId: "MIZUKI02",
    firstName: "鈴木",
    kanaFirstName: "スズキ",
    lastName: "二郎",
    kanaLastName: "ジロウ",
    userCategory: "一般",
    deptCode: "ACFD002",
    roleCode: "ACFP002",
    authId: "ROLEUSER",
    email: "suzuki@kaopiz.com",
    startDate: "2026/04/10",
    staffCode: "S002",
    remarks: "部署変更",
  },
  {
    id: 3,
    actionType: "消",
    userId: "MIZUKI03",
    firstName: "佐藤",
    kanaFirstName: "サトウ",
    lastName: "三郎",
    kanaLastName: "サブロウ",
    userCategory: "一般",
    deptCode: "ACFD003",
    roleCode: "ACFP003",
    authId: "ROLEUSER",
    email: "sato@kaopiz.com",
    startDate: "2026/04/11",
    staffCode: "S003",
    remarks: "退職予定",
  },
]);

const totalRecords = computed(() => (previewData.value.length > 0 ? 20 : 0));

// --- Handlers ---
const handleBack = () => {
  console.log("Quay lại màn hình trước...");
  // router.back();
};

const handleExecute = () => {
  console.log("Thực thi batch...");
  // Gọi API chạy batch ở đây
};
</script>

<template>
  <div class="p-6 min-h-screen">
    <a-card :bordered="false" class="rounded-lg">
      <template #title>
        <div class="flex justify-between items-center w-full">
          <span class="text-[1.8rem] font-bold text-gray-800">バッチ実行</span>
        </div>
      </template>

      <PreviewSummary :total="totalRecords" />

      <PreviewTable :data-source="previewData" />

      <PreviewActions @back="handleBack" @execute="handleExecute" />
    </a-card>
  </div>
</template>

<style scoped>
:deep(.ant-card-head) {
  border-bottom: none !important;
}
</style>
