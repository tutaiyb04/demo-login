<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLoading } from "@/composables/useLoading";
import type { FilterStatus, ImportRecord } from "@/types/UserImport";
import UserImportSearch from "@/components/UserManagementImport/UserImportSearch.vue";
import UserImportFilter from "@/components/UserManagementImport/UserImportFilter.vue";
import UserImportTable from "@/components/UserManagementImport/UserImportTable.vue";

const router = useRouter();
const { showLoading, hideLoading } = useLoading();

const searchQuery = ref("");
const selectedFilter = ref<FilterStatus>("all");
const totalResults = ref(0);
const dataSource = ref<ImportRecord[]>([]);

const fetchData = async () => {
  showLoading();
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    dataSource.value = [
      {
        id: "1",
        fileName: "user-import-template (2).csv",
        status: "未実施",
        uploadTime: "2026/03/02 17:22",
        uploaderName: "sato",
        completionTime: "",
      },
      {
        id: "2",
        fileName: "user-import-template (1)_ho...",
        status: "登録中",
        uploadTime: "2026/03/02 13:37",
        uploaderName: "sato",
        completionTime: "",
      },
      {
        id: "3",
        fileName: "user-import-success.csv",
        status: "成功",
        uploadTime: "2026/03/02 14:00",
        uploaderName: "sato",
        completionTime: "2026/03/02 14:05",
      },
      {
        id: "4",
        fileName: "user-import-error.csv",
        status: "失敗",
        uploadTime: "2026/03/02 15:00",
        uploaderName: "sato",
        completionTime: "2026/03/02 15:10",
      },
    ];
    totalResults.value = 115;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  } finally {
    hideLoading();
  }
};

const handleSearch = () => fetchData();

const goToNewImport = () => router.push("/user-import");

const handleExecuteBatch = (record: ImportRecord) => {
  console.log("Thực thi batch:", record.fileName);
  router.push("/user-import-preview");
};

const handleDelete = async (id: string) => {
  console.log("Gọi API xóa file ID:", id);
};

watch(selectedFilter, () => fetchData());

onMounted(() => fetchData());
</script>

<template>
  <section class="bg-white p-8 rounded-sm shadow-sm m-5">
    <h2 class="text-[1.8rem] !font-bold text-[#333333] mb-8">
      インポートファイル管理
    </h2>

    <UserImportSearch v-model="searchQuery" @search="handleSearch" />

    <UserImportFilter v-model="selectedFilter" />

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

    <UserImportTable
      :data-source="dataSource"
      @execute="handleExecuteBatch"
      @delete="handleDelete"
    />
  </section>
</template>
