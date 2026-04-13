<script setup lang="ts">
import PreviewActions from "@/components/userImportPreview/PreviewActions.vue";
import PreviewSummary from "@/components/userImportPreview/PreviewSummary.vue";
import PreviewTable from "@/components/userImportPreview/PreviewTable.vue";
import { useLoading } from "@/composables/useLoading";
import type { PreviewRecord } from "@/types/UserImport";
import api from "@/utils/axios";
import { message } from "ant-design-vue";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const { showLoading, hideLoading } = useLoading();

const previewData = ref<PreviewRecord[]>([]);
const totalRecords = ref(0);

const importId = computed(() => route.query.id as string);

onMounted(async () => {
  if (!importId.value) {
    message.error("Không tìm thấy dữ liệu Import.");
    router.push("/user-import-preview");
    return;
  }

  showLoading();
  try {
    // Gọi API lấy thông tin cấu hình Import từ Backend
    const response = await api.get(`/users/import/${importId.value}`);

    // Gán dữ liệu thật vào giao diện
    totalRecords.value = response.data.totalRecords || 0;

    // Lưu ý: previewData tạm thời để rỗng vì dữ liệu từng dòng đang nằm trong file CSV trên Hexabase
    previewData.value = response.data.previewData || [];
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

  console.log("Đang thực thi batch với ID:", importId.value);
  showLoading();

  try {
    // Gọi API execute ở Backend
    await api.post(`/users/import/execute/${importId.value}`);

    message.success("インポートを実行しました。"); // Đã thực hiện import

    // Thành công thì đá về trang Quản lý danh sách
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
