<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useLoading } from "@/composables/useLoading";
import type { Department } from "@/types/UserImport";

// Import các component con (GIỮ NGUYÊN KHÔNG ĐỔI)
import UserImportHeader from "@/components/userImport/UserImportHeader.vue";
import UserImportForm from "@/components/userImport/UserImportForm.vue";
import UserImportActions from "@/components/userImport/UserImportActions.vue";
import api from "@/utils/axios";

const { showLoading, hideLoading } = useLoading();
const router = useRouter();

// --- States ---
const selectedDepartment = ref<string | undefined>(undefined);
const fileList = ref<any[]>([]);
const departmentOptions = ref<Department[]>([]);

const isErrorModalVisible = ref(false);
const errorList = ref<any[]>([]);
const errorColumns = [
  {
    title: "行番号",
    dataIndex: "rowIndex",
    key: "rowIndex",
    width: 80,
    align: "center",
  },
  { title: "エラーメッセージ", dataIndex: "message", key: "message" },
];

const isPreviewModalVisible = ref(false);
const previewData = ref<any[]>([]);
const previewColumns = [
  { title: "操作", dataIndex: "操作", key: "action" },
  { title: "ユーザーID", dataIndex: "ユーザーID", key: "userId" },
  { title: "名前", dataIndex: "名前", key: "name" },
  { title: "メールアドレス", dataIndex: "メールアドレス", key: "email" },
  { title: "部署コード", dataIndex: "部署コード", key: "deptCode" },
];

// Trạng thái Disable form
const isDownloading = ref(false);
const isPreviewing = ref(false);
const isUploading = ref(false);

const isFormDisabled = computed(() => {
  return isUploading.value || isPreviewing.value || isDownloading.value;
});

const isSubmitDisabled = computed(() => {
  return !selectedDepartment.value || fileList.value?.length === 0;
});

// --- Lifecycle ---
onMounted(async () => {
  showLoading();
  try {
    const response = await api.get("/departments");
    // Giả sử API trả về mảng object, map lại đúng định dạng của Ant Design Select
    departmentOptions.value = response.data.map((dept: any) => ({
      value: dept.DepartmentCode,
      label: dept.DepartmentName,
    }));
  } catch (error: any) {
    console.error(error);
    message.error("部署リストの取得に失敗しました。"); // Lỗi lấy danh sách phòng ban
  } finally {
    hideLoading();
  }
});

// --- Hàm tiện ích ---
const getRawFile = () => {
  const currentFile = fileList.value[0];
  return currentFile ? currentFile.originFileObj || currentFile : null;
};

// --- API Handlers ---

const downloadTemplate = async () => {
  isDownloading.value = true;
  showLoading();
  try {
    const response = await api.get("/users/import/template");

    // Xử lý tạo link ảo để trình duyệt tải file Blob về máy
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Lấy tên file từ header 'content-disposition' (nếu BE có trả) hoặc set cứng
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "user_import_template.csv";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success("テンプレートファイルをダウンロードしました。");
  } catch (error: any) {
    message.error("ダウンロードに失敗しました。");
  } finally {
    isDownloading.value = false;
    hideLoading();
  }
};

const handleCancel = () => {
  selectedDepartment.value = undefined;
  fileList.value = [];
  router.push("/user-import-management");
};

const handlePreview = async () => {
  const fileToUpload = getRawFile();
  if (!selectedDepartment.value || !fileToUpload) return;

  isPreviewing.value = true;
  showLoading();

  try {
    // Đóng gói dữ liệu thành dạng form-data
    const formData = new FormData();
    formData.append("departmentId", selectedDepartment.value);
    formData.append("file", fileToUpload);

    // Gọi API Preview
    const response = await api.post("/users/import/preview", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    previewData.value = response.data.data;
    isPreviewModalVisible.value = true;
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      errorList.value = error.response.data.errors;
      isErrorModalVisible.value = true;
    } else {
      message.error(
        "プレビューに失敗しました。サーバーとの接続を確認してください。",
      );
    }
  } finally {
    isPreviewing.value = false;
    hideLoading();
  }
};

const handleUpload = async () => {
  const fileToUpload = getRawFile();
  if (!selectedDepartment.value || !fileToUpload) return;

  isUploading.value = true;
  showLoading();
  try {
    // Đóng gói dữ liệu thành dạng form-data
    const formData = new FormData();
    formData.append("departmentId", selectedDepartment.value);
    formData.append("file", fileToUpload);

    await api.post("/users/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    message.success("アップロードに成功しました。");

    // Dọn dẹp form sau khi upload thành công
    fileList.value = [];
    selectedDepartment.value = undefined;

    // Tuỳ chọn: Điều hướng về màn hình quản lý lịch sử import
    // router.push("/user-import-management");
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "アップロードに失敗しました。";
    message.error(errorMsg);
  } finally {
    isUploading.value = false;
    hideLoading();
  }
};
</script>

<template>
  <div class="p-6 bg-[#f0f2f5] min-h-screen">
    <section class="bg-white p-10 rounded-sm shadow-sm">
      <UserImportHeader
        :disabled="isFormDisabled"
        @download="downloadTemplate"
      />

      <UserImportForm
        v-model:departmentId="selectedDepartment"
        v-model:fileList="fileList"
        :department-options="departmentOptions"
        :disabled="isFormDisabled"
      />

      <UserImportActions
        :is-submit-disabled="isSubmitDisabled"
        :disabled="isFormDisabled"
        @cancel="handleCancel"
        @preview="handlePreview"
        @upload="handleUpload"
      />
    </section>
  </div>

  <a-modal
    v-model:open="isErrorModalVisible"
    title="エラー確認"
    :footer="null"
    width="800px"
    centered
  >
    <div class="mb-4 text-[#f5222d] font-bold text-[1.4rem]">
      エラーレコード合計: {{ errorList.length }} 件
    </div>
    <a-table
      :columns="errorColumns"
      :data-source="errorList"
      :pagination="{ pageSize: 10 }"
      size="middle"
      row-key="rowIndex"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'rowIndex'">
          {{ record.rowIndex + 1 }}
        </template>
      </template>
    </a-table>
  </a-modal>

  <a-modal
    v-model:open="isPreviewModalVisible"
    title="プレビュー"
    :footer="null"
    width="1000px"
    centered
    wrapClassName="preview-modal"
  >
    <div class="mb-4 text-[#0072c6] font-bold text-[1.4rem]">
      以下のデータがインポートされます（最初の20件を表示）
    </div>
    <a-table
      :columns="previewColumns"
      :data-source="previewData"
      :pagination="false"
      :scroll="{ x: 'max-content', y: 400 }"
      size="middle"
    />
    <div class="flex justify-end mt-6">
      <a-button
        type="primary"
        @click="
          () => {
            isPreviewModalVisible = false;
            handleUpload();
          }
        "
        class="!bg-[#0072c6] !h-[40px] text-[1.4rem]"
        :loading="isUploading"
      >
        アップロードを実行する
      </a-button>
    </div>
  </a-modal>
</template>
