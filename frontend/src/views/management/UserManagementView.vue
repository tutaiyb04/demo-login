<script setup lang="ts">
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLoading } from "@/composables/useLoading"; // Nhập useLoading

// --- Types & Interfaces ---
type FilterStatus = "all" | "pending" | "registering" | "success" | "failed";

interface ImportRecord {
  id: string;
  fileName: string;
  status: "未実施" | "登録中" | "成功" | "失敗";
  uploadTime: string;
  uploaderName: string;
  completionTime: string;
}

// --- Constants ---
const STATUS_COLORS: Record<string, string> = {
  未実施: "#9d9d9d",
  登録中: "#d8d8d8",
  成功: "#05a605",
  失敗: "#f30000",
};

const router = useRouter();
const { showLoading, hideLoading } = useLoading(); // Sử dụng global loading

// --- States ---
const searchQuery = ref("");
const selectedFilter = ref<FilterStatus>("pending");
const totalResults = ref(0);
const dataSource = ref<ImportRecord[]>([]);

// --- Bảng Columns ---
const columns = [
  {
    title: "バッチ実行",
    dataIndex: "batch",
    key: "batch",
    width: 120,
    align: "center",
  },
  { title: "ファイル名", dataIndex: "fileName", key: "fileName", width: 250 },
  { title: "ステータス", dataIndex: "status", key: "status", width: 120 },
  {
    title: "アップロード時刻",
    dataIndex: "uploadTime",
    key: "uploadTime",
    width: 160,
  },
  {
    title: "アップロード者名",
    dataIndex: "uploaderName",
    key: "uploaderName",
    width: 180,
  },
  {
    title: "完了日時",
    dataIndex: "completionTime",
    key: "completionTime",
    width: 160,
  },
  { title: "操作", key: "action", width: 80, align: "center" },
];

// --- Hàm xử lý Logic ---

const getStatusColor = (status: string) => {
  return STATUS_COLORS[status] || "#333333";
};

const isRowDisabled = (status: string) => {
  return ["登録中", "成功", "失敗"].includes(status);
};

// Hàm xử lý khi click vào Checkbox để đảm bảo chỉ chọn 1
const handleFilterChange = (filterValue: FilterStatus) => {
  selectedFilter.value = filterValue;
};

const goToNewImport = () => {
  router.push("/user-import");
};

// --- Tương tác API (MOCK) ---

const fetchData = async () => {
  showLoading(); // Bật global loading
  try {
    // TODO: Thay thế bằng code gọi axios/fetch API thật
    // const response = await api.get('/imports', { params: { search: searchQuery.value, status: selectedFilter.value } });

    // Fake delay API 0.5s để nhìn rõ hiệu ứng global loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Dữ liệu giả lập
    dataSource.value = [
      {
        id: "1",
        fileName: "user-import-template (2).csv",
        status: "未実施",
        uploadTime: "2026/03/02 17:22",
        uploaderName: "sato last sato fist",
        completionTime: "",
      },
      {
        id: "2",
        fileName: "user-import-template (1)_ho...",
        status: "登録中",
        uploadTime: "2026/03/02 13:37",
        uploaderName: "sato last sato fist",
        completionTime: "",
      },
      {
        id: "3",
        fileName: "user-import-success.csv",
        status: "成功",
        uploadTime: "2026/03/02 14:00",
        uploaderName: "sato last sato fist",
        completionTime: "2026/03/02 14:05",
      },
      {
        id: "4",
        fileName: "user-import-error.csv",
        status: "失敗",
        uploadTime: "2026/03/02 15:00",
        uploaderName: "sato last sato fist",
        completionTime: "2026/03/02 15:10",
      },
    ];
    totalResults.value = 115;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  } finally {
    hideLoading(); // Tắt global loading dù thành công hay lỗi
  }
};

const executeBatch = async (record: ImportRecord) => {
  router.push("/user-import-preview");
};

const handleDelete = async (id: string) => {
  console.log("Gọi API xóa file ID:", id);
};

const handleSearch = () => {
  fetchData();
};

// Tự động gọi lại API khi đổi filter
watch(selectedFilter, () => {
  fetchData();
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <section class="bg-white p-8 rounded-sm shadow-sm m-5">
    <h2 class="text-[1.8rem] !font-bold text-[#333333] mb-8">
      インポートファイル管理
    </h2>

    <div class="flex mb-6">
      <a-input
        v-model:value="searchQuery"
        placeholder="検索ワードを入力してください"
        class="flex-1 h-[44px] !text-[1.6rem] !rounded-r-none"
        @pressEnter="handleSearch"
      />
      <a-button
        type="primary"
        class="w-[100px] !h-[44px] p-0 flex items-center justify-center !text-[1.6rem] search-btn shadow-none !rounded-l-none"
        @click="handleSearch"
      >
        <div class="flex items-center justify-center gap-1.5 mt-[2px]">
          <SearchOutlined class="text-[2rem] flex items-center" />
          <span class="leading-none flex items-center">検索</span>
        </div>
      </a-button>
    </div>

    <div class="flex gap-6 mb-8 text-[1.4rem]">
      <a-checkbox
        :checked="selectedFilter === 'all'"
        @change="handleFilterChange('all')"
        >すべて</a-checkbox
      >
      <a-checkbox
        :checked="selectedFilter === 'pending'"
        @change="handleFilterChange('pending')"
        >未実施</a-checkbox
      >
      <a-checkbox
        :checked="selectedFilter === 'registering'"
        @change="handleFilterChange('registering')"
        >登録中</a-checkbox
      >
      <a-checkbox
        :checked="selectedFilter === 'success'"
        @change="handleFilterChange('success')"
        >成功</a-checkbox
      >
      <a-checkbox
        :checked="selectedFilter === 'failed'"
        @change="handleFilterChange('failed')"
        >失敗</a-checkbox
      >
    </div>

    <div class="flex justify-end mb-8">
      <a-button
        type="primary"
        class="h-[40px] w-[144px] text-[1.4rem] !bg-[#0072c6] hover:!bg-[#40a9ff] border-none shadow-none"
        @click="goToNewImport"
      >
        新規インポート
      </a-button>
    </div>

    <div class="text-[1.4rem] text-[#333333] mb-4 font-medium">
      検索結果：{{ totalResults }}件
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'batch'">
          <a-button
            v-if="!isRowDisabled(record.status)"
            type="primary"
            class="!bg-[#0072c6] hover:!bg-[#40a9ff] border-none !text-[1.2rem] h-[28px] px-4 rounded"
            @click="executeBatch(record)"
          >
            バッチ実行
          </a-button>
        </template>

        <template v-else-if="column.key === 'status'">
          <span
            class="font-medium"
            :style="{ color: getStatusColor(record.status) }"
          >
            {{ record.status }}
          </span>
        </template>

        <template v-else-if="column.key === 'action'">
          <DeleteOutlined
            :class="
              isRowDisabled(record.status)
                ? '!text-[#bfbfbf] cursor-not-allowed text-[1.8rem]'
                : '!text-[#0072c6] hover:!text-[#40a9ff] cursor-pointer transition-colors text-[1.8rem]'
            "
            :title="isRowDisabled(record.status) ? '' : '削除'"
            @click="!isRowDisabled(record.status) && handleDelete(record.id)"
          />
        </template>
      </template>
    </a-table>
  </section>
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

/* CSS cho Checkbox */
:deep(.ant-checkbox-wrapper) {
  font-size: 1.4rem;
  color: #333;
}

/* CSS cho Table */
:deep(.ant-table-thead > tr > th) {
  background-color: #ececec !important;
  color: #333333;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 10px 16px !important;
}

:deep(.ant-table-thead > tr > th::before) {
  display: block !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px !important;
  white-space: nowrap;
  color: #333;
}
</style>
