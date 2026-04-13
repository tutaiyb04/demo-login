<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useLoading } from "@/composables/useLoading";
import type { Department } from "@/types/UserImport";

import UserImportHeader from "@/components/userImport/UserImportHeader.vue";
import UserImportForm from "@/components/userImport/UserImportForm.vue";
import UserImportActions from "@/components/userImport/UserImportActions.vue";
import api from "@/utils/axios";

const { showLoading, hideLoading } = useLoading();
const router = useRouter();

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
  {
    title: "操作",
    dataIndex: "操作",
    key: "action",
    width: 80,
    align: "center" as const,
  },
  {
    title: "ユーザーID",
    dataIndex: "ユーザーID",
    key: "userId",
    width: 120,
  },
  { title: "苗字", dataIndex: "苗字", key: "lastName", width: 120 },
  { title: "名前", dataIndex: "名前", key: "firstName", width: 120 },
  { title: "仮名苗字", dataIndex: "仮名苗字", key: "kanaLastName", width: 150 },
  {
    title: "仮名名前",
    dataIndex: "仮名名前",
    key: "kanaFirstName",
    width: 150,
  },
  {
    title: "ユーザー分類",
    dataIndex: "ユーザー分類",
    key: "userCategory",
    width: 120,
  },
  { title: "部署コード", dataIndex: "部署コード", key: "deptCode", width: 120 },
  { title: "役割コード", dataIndex: "役割コード", key: "roleCode", width: 120 },
  { title: "権限ID", dataIndex: "権限ID", key: "authId", width: 120 },
  {
    title: "メールアドレス",
    dataIndex: "メールアドレス",
    key: "email",
    width: 220,
  },
  {
    title: "利用開始日",
    dataIndex: "利用開始日",
    key: "startDate",
    width: 120,
  },
  {
    title: "スタッフコード",
    dataIndex: "スタッフコード",
    key: "staffCode",
    width: 150,
  },
  { title: "備考", dataIndex: "備考", key: "remarks", width: 200 },
];

const isDownloading = ref(false);
const isPreviewing = ref(false);
const isUploading = ref(false);

const isFormDisabled = computed(() => {
  return isUploading.value || isPreviewing.value || isDownloading.value;
});

const isSubmitDisabled = computed(() => {
  return !selectedDepartment.value || fileList.value?.length === 0;
});

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

const getRawFile = () => {
  const currentFile = fileList.value[0];
  return currentFile ? currentFile.originFileObj || currentFile : null;
};

const downloadTemplate = async () => {
  isDownloading.value = true;
  showLoading();
  try {
    const response = await api.get("/users/import/template", {
      responseType: "blob",
    });

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
    const formData = new FormData();
    formData.append("departmentId", selectedDepartment.value);
    formData.append("file", fileToUpload);

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

  if (!fileToUpload.name.toLowerCase().endsWith(".csv")) {
    message.error("CSVファイルを選択してください。");
    return;
  }

  isUploading.value = true;
  showLoading();
  try {
    const formData = new FormData();
    formData.append("departmentId", selectedDepartment.value);
    formData.append("file", fileToUpload);

    const response = await api.post("/users/import", formData);
    message.success("アップロードに成功しました。");

    fileList.value = [];
    selectedDepartment.value = undefined;

    const importId = response.data?.item_id || response.data?.id;

    if (importId) {
      router.push({ path: "/user-import", query: { id: importId } });
    }
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      errorList.value = error.response.data.errors;
      isErrorModalVisible.value = true;
    } else {
      const errorMsg =
        error.response?.data?.message || "アップロードに失敗しました。";
      message.error(errorMsg);
    }
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
    v-model:open="isPreviewModalVisible"
    title="インポートデータのプレビュー"
    :footer="null"
    width="900px"
    centered
  >
    <div class="mb-4 text-[#333] text-[1.4rem]">
      ファイルにエラーは見つかりませんでした。以下の内容でインポートされます。
    </div>

    <a-table
      :columns="previewColumns"
      :data-source="previewData"
      :pagination="false"
      :scroll="{ x: 1900, y: 400 }"
      size="middle"
      row-key="ユーザーID"
      bordered
    />
  </a-modal>

  <a-modal
    v-model:open="isErrorModalVisible"
    title="ユーザーインポートエラー"
    :footer="null"
    width="850px"
    centered
  >
    <div class="mb-4 text-[#333] text-[1.4rem]">
      エラーレコード合計 <span class="font-bold">{{ errorList.length }}</span>
    </div>

    <a-table
      :columns="errorColumns"
      :data-source="errorList"
      :pagination="{ pageSize: 10, position: ['bottomCenter'] }"
      size="middle"
      row-key="rowIndex"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'rowIndex'">
          {{ record.rowIndex }}
        </template>

        <template v-if="column.key === 'message'">
          <ul class="list-disc pl-5 m-0 text-left">
            <li
              v-for="(msg, idx) in record.message"
              :key="idx"
              class="text-[#333]"
            >
              {{ msg }}
            </li>
          </ul>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>
