<script setup lang="ts">
import PreviewActions from "@/components/userImportPreview/PreviewActions.vue";
import PreviewSummary from "@/components/userImportPreview/PreviewSummary.vue";
import PreviewTable from "@/components/userImportPreview/PreviewTable.vue";
import { useLoading } from "@/composables/useLoading";
import type { PreviewRecord } from "@/types/UserImport";
import api from "@/utils/axios";
import { message } from "ant-design-vue";
import type { TableColumnType } from "ant-design-vue";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const { showLoading, hideLoading } = useLoading();

const previewDataList = ref<PreviewRow[]>([]);
const importInfo = ref<any>({});
const totalRecords = ref(0);

const importId = computed(() => route.query.id as string);

/** Same row union as `PreviewTable` (CSV keys or `PreviewRecord`). */
type PreviewRow = PreviewRecord | Record<string, unknown>;

const previewColumns: TableColumnType<PreviewRow>[] = [
  {
    title: "操作",
    dataIndex: "操作",
    key: "action",
    width: 80,
    align: "center" as const,
  },
  { title: "ユーザーID", dataIndex: "ユーザーID", key: "userId" },
  { title: "名前", dataIndex: "名前", key: "firstName" },
  { title: "仮名名前", dataIndex: "仮名名前", key: "firstNameKana" },
  { title: "苗字", dataIndex: "苗字", key: "lastName" },
  { title: "仮名苗字", dataIndex: "仮名苗字", key: "lastNameKana" },
  { title: "ユーザー分類", dataIndex: "ユーザー分類", key: "userType" },
  { title: "部署コード", dataIndex: "部署コード", key: "departmentCode" },
  { title: "役割コード", dataIndex: "役割コード", key: "roleCode" },
  { title: "権限ID", dataIndex: "権限ID", key: "authId" },
  { title: "メールアドレス", dataIndex: "メールアドレス", key: "email" },
  { title: "利用開始日", dataIndex: "利用開始日", key: "startDate" },
  { title: "スタッフコード", dataIndex: "スタッフコード", key: "staffCode" },
  { title: "備考", dataIndex: "備考", key: "note" },
];

onMounted(async () => {
  if (!importId.value) {
    message.error("Không tìm thấy dữ liệu Import.");
    router.push("/user-import-management");
    return;
  }

  showLoading();
  try {
    // Gọi API lấy thông tin cấu hình Import từ Backend
    const response = await api.get(`/users/import/${importId.value}`);

    importInfo.value = response.data;
    totalRecords.value = response.data.totalRecords || 0;

    previewDataList.value = response.data.previewData || [];
  } catch (error: any) {
    console.error(error);
    message.error("Lấy dữ liệu cấu hình thất bại.");
  } finally {
    hideLoading();
  }
});

const handleBack = () => {
  router.push("/user-import-management");
};

const handleExecute = async () => {
  if (!importId.value) {
    message.error("Không tìm thấy dữ liệu Import.");
    return;
  }

  showLoading();

  try {
    // Gọi API execute ở Backend
    await api.post(`/users/import/execute/${importId.value}`);

    message.success("インポートを実行しました。");

    router.push("/user-import-management");
  } catch (error: any) {
    message.error(
      error.response?.data?.message || "インポートの実行に失敗しました。",
    );
  } finally {
    hideLoading();
  }
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

      <PreviewTable :data-source="previewDataList" :columns="previewColumns" />

      <PreviewActions @back="handleBack" @execute="handleExecute" />
    </a-card>
  </div>
</template>

<style scoped>
:deep(.ant-card-head) {
  border-bottom: none !important;
}
</style>
