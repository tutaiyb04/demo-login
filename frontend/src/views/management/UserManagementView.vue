<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLoading } from "@/composables/useLoading";
import type { FilterStatus, ImportRecord } from "@/types/UserImport";
import UserImportSearch from "@/components/UserManagementImport/UserImportSearch.vue";
import UserImportFilter from "@/components/UserManagementImport/UserImportFilter.vue";
import UserImportTable from "@/components/UserManagementImport/UserImportTable.vue";
import { message } from "ant-design-vue";
import api from "@/utils/axios";

const router = useRouter();
const { showLoading, hideLoading } = useLoading();

const searchQuery = ref("");
const selectedFilter = ref<FilterStatus>("all");
const totalResults = ref(0);
const dataSource = ref<ImportRecord[]>([]);

const fetchData = async () => {
  showLoading();
  try {
    // Thay thế đoạn setTimeout và mock data
    const response = await api.get("/users/import/list", {
      params: {
        page: 1, // Bạn có thể thêm biến ref pagination nếu muốn làm phân trang
        perPage: 10,
        status:
          selectedFilter.value !== "all" ? selectedFilter.value : undefined,
      },
    });

    const dict: Record<string, string> = {
      // Dành cho trường hợp Hexabase trả về Text (phổ biến nhất)
      Uploaded: "未実施",
      uploaded: "未実施",
      Processing: "登録中",
      processing: "登録中",
      Registered: "完了",
      registered: "完了",
      Failed: "エラー",
      failed: "エラー",

      // Dành cho trường hợp Hexabase trả về Option ID (dự phòng)
      "69ce7c0caef0277b05eb41d3": "未実施",
      "69ce7c2baef0277b05eb41d4": "登録中",
      "69ce7c562403b7456177b960": "完了",
      "69ce7d60aef0277b05eb41d6": "エラー",
    };

    // Cập nhật dữ liệu từ API trả về
    dataSource.value = response.data.items.map((item: any) => {
      let rawStatus = item.status;

      if (Array.isArray(rawStatus)) rawStatus = rawStatus[0];
      if (rawStatus && typeof rawStatus === "object") {
        rawStatus =
          rawStatus.id || rawStatus.value || rawStatus.name || rawStatus;
      }

      // Ép về chuỗi chuẩn để tra từ điển
      const statusKey = String(rawStatus || "").trim();

      return {
        ...item,
        // Tra vào từ điển, nếu có thì ra tiếng Nhật, không có thì giữ nguyên tiếng Anh
        status: dict[statusKey] || statusKey || "未実施",
      };
    });

    totalResults.value = response.data.total;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Hexabase:", error);
    message.error("Dữ liệu không thể tải xuống.");
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
