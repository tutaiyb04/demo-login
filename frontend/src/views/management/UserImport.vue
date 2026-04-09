<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  InboxOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { UploadProps } from "ant-design-vue";
import { useLoading } from "@/composables/useLoading";
import { useRouter } from "vue-router";

// --- Types & Interfaces ---
interface Department {
  value: string;
  label: string;
}

// Khởi tạo global loading
const { showLoading, hideLoading } = useLoading();
const router = useRouter();

// --- States ---
const selectedDepartment = ref<string | undefined>(undefined);
const fileList = ref<any[]>([]); // Chứa object file của Antd hoặc native File
const departmentOptions = ref<Department[]>([]);

// Trạng thái Disable form (khi đang call API)
const isDownloading = ref(false);
const isPreviewing = ref(false);
const isUploading = ref(false);

// --- Khởi tạo dữ liệu (Fetch Data) ---
const fetchDepartments = async () => {
  showLoading(); // Bật loading khi mới vào trang
  try {
    // TODO: Thay bằng API lấy danh sách công ty/phòng ban thực tế
    // const res = await api.get('/departments');
    // departmentOptions.value = res.data;

    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Dữ liệu mock tạm thời
    departmentOptions.value = [
      { value: "comp1", label: "MiZuki会社" },
      { value: "comp2", label: "TechCorp" },
      { value: "comp3", label: "Global Inc" },
    ];
  } catch (error) {
    message.error("部署リストの取得に失敗しました。");
  } finally {
    hideLoading(); // Tắt loading
  }
};

onMounted(() => {
  fetchDepartments();
});

// --- Logic Disable Nút ---
const isSubmitDisabled = computed(() => {
  return !selectedDepartment.value || fileList.value?.length === 0;
});

// --- Upload Handling ---
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  fileList.value = [file]; // Chỉ giữ lại 1 file mới nhất
  return false; // Ngăn Ant Design tự động gửi request
};

const handleRemove = () => {
  fileList.value = [];
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    fileList.value = [file];
  }
};

// Hàm tiện ích: Lấy ra file gốc (Native File) để gửi đi
const getRawFile = () => {
  const currentFile = fileList.value[0];
  if (!currentFile) return null;
  // File từ beforeUpload có originFileObj, File từ drop là native luôn
  return currentFile.originFileObj || currentFile;
};

// --- Hành động Nút (API Integrations) ---

const downloadTemplate = async () => {
  isDownloading.value = true;
  showLoading(); // Có thể áp dụng global loading cho cả download
  try {
    // TODO: Gọi API tải file template
    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 800));
    message.success("テンプレートファイルをダウンロードしました。");
  } catch (error) {
    message.error("ダウンロードに失敗しました。");
  } finally {
    isDownloading.value = false;
    hideLoading();
  }
};

const handleCancel = () => {
  // Reset form
  selectedDepartment.value = undefined;
  fileList.value = [];
  router.push("/user-import-management");
};

const handlePreview = async () => {
  const fileToUpload = getRawFile();
  if (!selectedDepartment.value || !fileToUpload) return;

  isPreviewing.value = true;
  showLoading(); // Bật loading khi click preview
  try {
    const formData = new FormData();
    formData.append("departmentId", selectedDepartment.value);
    formData.append("file", fileToUpload);

    // TODO: Gọi API Preview
    // const res = await api.post('/users/import/preview', formData, ...);

    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Dữ liệu preview:", formData.get("file"));
    message.success("プレビューデータを取得しました。");
    // Code chuyển sang trang preview (nếu có)
  } catch (error) {
    message.error("プレビューに失敗しました。");
  } finally {
    isPreviewing.value = false;
    hideLoading(); // Tắt loading
  }
};

const handleUpload = async () => {
  const fileToUpload = getRawFile();
  if (!selectedDepartment.value || !fileToUpload) return;

  isUploading.value = true;
  showLoading(); // Bật loading khi click upload
  try {
    const formData = new FormData();
    formData.append("departmentId", selectedDepartment.value);
    formData.append("file", fileToUpload);

    // TODO: Gọi API Upload chính thức
    // await api.post('/users/import/upload', formData, ...);

    // Giả lập delay mạng
    await new Promise((resolve) => setTimeout(resolve, 1500));

    message.success("アップロードに成功しました。");
    // Upload xong thì xóa file đi để sẵn sàng cho lần upload sau
    handleRemove();
  } catch (error) {
    message.error("アップロードに失敗しました。");
  } finally {
    isUploading.value = false;
    hideLoading(); // Tắt loading
  }
};
</script>

<template>
  <div class="p-6 bg-[#f0f2f5] min-h-screen">
    <section class="bg-white p-10 rounded-sm shadow-sm">
      <div class="flex justify-between items-center mb-10 gap-6">
        <h2 class="text-[1.8rem] font-bold! text-[#333333] m-0">
          ユーザーインポート
        </h2>
        <a-button
          size="large"
          class="h-[44px]! px-10! text-[1.5rem]! font-bold! rounded! border-[#0072c6]! text-[#0072c6]! hover:bg-[#f0f8ff]!"
          @click="downloadTemplate"
        >
          テンプレートファイル
        </a-button>
      </div>

      <div class="mb-14">
        <div class="flex items-center mb-3 gap-2">
          <label class="text-[1.4rem] font-bold! text-[#333333]">部署名</label>
          <span
            class="bg-[#ff4d4f] text-white text-[11px] px-[6px] py-[2px] rounded font-bold leading-none"
          >
            必須
          </span>
        </div>
        <a-select
          v-model:value="selectedDepartment"
          :options="departmentOptions"
          placeholder="選択してください"
          class="w-[320px]"
          size="large"
          :disabled="isUploading || isPreviewing || isDownloading"
        />
      </div>

      <div class="mb-10">
        <div class="flex items-center mb-3 gap-2">
          <label class="text-[1.4rem] font-bold text-[#333333]">
            ファイルアップロード
          </label>
          <span
            class="bg-[#ff4d4f] text-white text-[11px] px-[6px] py-[2px] rounded font-bold leading-none"
          >
            必須
          </span>
        </div>

        <div class="rounded-md border border-[#d9d9d9] bg-[#ececec]">
          <div
            class="h-[220px] flex flex-col items-center justify-center px-6"
            @dragover.prevent
            @dragenter.prevent
            @drop="handleDrop"
            :class="{
              'opacity-60 pointer-events-none':
                isUploading || isPreviewing || isDownloading,
            }"
          >
            <template v-if="!fileList || fileList.length === 0">
              <InboxOutlined class="text-[44px] text-[#b3b3b3] mb-4" />
              <p class="text-[#9b9b9b] text-[1.4rem] m-0">
                ここにファイルをドロップしてアップロード
              </p>
            </template>

            <template v-else>
              <div
                class="flex items-center gap-4 bg-white px-6 py-4 rounded shadow-sm border border-[#e6e6e6]"
              >
                <span
                  class="text-[1.6rem] font-medium text-[#333] max-w-[520px] truncate"
                  :title="fileList[0].name"
                >
                  {{ fileList[0].name }}
                </span>
                <DeleteOutlined
                  v-if="!isUploading && !isPreviewing"
                  class="text-[1.8rem] text-[#f5222d] cursor-pointer hover:text-[#cf1322] transition-colors"
                  @click="handleRemove"
                  title="削除"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="px-6 pb-6 mt-4">
          <a-upload
            v-model:fileList="fileList"
            :showUploadList="false"
            :before-upload="beforeUpload"
            :disabled="isUploading || isPreviewing || isDownloading"
          >
            <button
              type="button"
              class="inline-flex items-center gap-2 !text-[#0072c6] hover:underline text-[1.4rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isUploading || isPreviewing || isDownloading"
            >
              ファイルを選択してアップロード
              <UploadOutlined class="text-[1.6rem]" />
            </button>
          </a-upload>
        </div>
      </div>

      <div class="flex justify-center items-center gap-6 mt-16 mb-4">
        <a-button
          size="large"
          class="h-[44px]! w-[160px]! rounded! font-bold! text-[1.4rem]! border-[#0072c6]! text-[#0072c6]! hover:bg-[#f0f8ff]!"
          :disabled="isUploading || isPreviewing || isDownloading"
          @click="handleCancel"
        >
          キャンセル
        </a-button>
        <a-button
          size="large"
          type="primary"
          :disabled="isSubmitDisabled"
          :class="
            isSubmitDisabled
              ? 'h-[44px]! w-[160px]! rounded! font-bold! text-[1.4rem]! bg-[#d8d8d8]! border-[#d8d8d8]! text-white! shadow-none'
              : 'h-[44px]! w-[160px]! rounded! font-bold! text-[1.4rem]! bg-[#0072c6]! border-[#0072c6]! hover:bg-[#40a9ff]! shadow-none'
          "
          @click="handlePreview"
        >
          プレビュー
        </a-button>
        <a-button
          size="large"
          type="primary"
          :disabled="isSubmitDisabled"
          :class="
            isSubmitDisabled
              ? 'h-[44px]! w-[160px]! rounded! font-bold! text-[1.4rem]! bg-[#d8d8d8]! border-[#d8d8d8]! text-white! shadow-none'
              : 'h-[44px]! w-[160px]! rounded! font-bold! text-[1.4rem]! bg-[#0072c6]! border-[#0072c6]! hover:bg-[#40a9ff]! shadow-none'
          "
          @click="handleUpload"
        >
          アップロード
        </a-button>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
