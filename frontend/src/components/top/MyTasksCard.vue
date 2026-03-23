<script setup lang="ts">
import type { TableSorter, TaskRecord } from "@/types/top";
import type { TableColumnsType } from "ant-design-vue";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

type SortOrder = "ascend" | "descend" | null;
const sortOrder = ref<SortOrder>(null);

const taskColumns: TableColumnsType = [
  { title: "ステータス", dataIndex: "status", key: "status", width: "10%" },
  { title: "申請書種別", dataIndex: "type", key: "type", width: "15%" },
  { title: "申請タイトル", dataIndex: "title", key: "title", width: "45%" },
  { title: "承認者", dataIndex: "approver", key: "approver", width: "15%" },
  {
    title: "最終更新日",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: "15%",
    sorter: true,
    sortDirections: ["descend", "ascend"],
  },
];

const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 50,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "50"],
});

const handleTableChange = (
  pag: any,
  filters: unknown,
  sorter: TableSorter | TableSorter[],
) => {
  const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;
  sortOrder.value = sorterObj?.order || null;

  if (pag) {
    pagination.current = pag.current;
    pagination.pageSize = pag.pageSize;
  }
};

const getTooltipText = (order: string | null) => {
  if (order === "descend") return "Click to sort ascending";
  if (order === "ascend") return "Cancel sorting";
  return "Click to sort descending";
};

const goToAppliedTasks = () => {
  router.push("/completed-applications-list");
};
</script>

<template>
  <a-card :bordered="false" class="w-full shadow-sm custom-card">
    <template #title>
      <span class="text-[1.8rem] font-bold text-[#333333]">申請タスク</span>
    </template>

    <section class="flex flex-col mt-4">
      <a-table
        :columns="taskColumns"
        :data-source="[]"
        :pagination="false"
        :showSorterTooltip="false"
        @change="handleTableChange"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'updatedAt'">
            <div class="flex items-center gap-1.5">
              <span>{{ column.title }}</span>

              <a-tooltip :title="getTooltipText(sortOrder)" placement="top">
                <div class="flex items-center cursor-pointer">
                  <svg
                    v-if="sortOrder === 'descend'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="11" fill="#a1a1a1" />
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="white"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="11" fill="#a1a1a1" />
                    <path
                      d="M7 14L12 9L17 14"
                      stroke="white"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </a-tooltip>
            </div>
          </template>
          <template v-else>
            {{ column.title }}
          </template>
        </template>

        <template #emptyText>
          <div class="py-16 text-[#888888] text-[1.5rem]">データなし</div>
        </template>
      </a-table>

      <div class="flex justify-end mt-10">
        <div
          class="flex items-center gap-1 text-[#407faf] hover:text-[#23689b] cursor-pointer text-[1.6rem] font-medium transition-colors"
          @click="goToAppliedTasks"
        >
          <span class="mr-1.5">申請済み一覧</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </div>
      </div>
    </section>
  </a-card>
</template>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #ececec !important;
  color: #333333;
  font-weight: 600;
  border-bottom: none !important;
  padding: 6px 16px !important;
}

:deep(.ant-table-thead > tr > th::before) {
  display: none !important;
}

:deep(.ant-table-placeholder) {
  border-top: none !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.ant-table-column-sorter) {
  display: none !important;
}
</style>
