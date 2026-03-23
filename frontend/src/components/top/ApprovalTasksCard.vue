<script setup lang="ts">
import type { TableSorter, ApprovalTaskRecord } from "@/types/top";
import type { TableColumnsType } from "ant-design-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

type SortOrder = "ascend" | "descend" | null;
const sortOrder = ref<SortOrder>(null);

const approvalTaskColumns: TableColumnsType = [
  {
    title: "申請日",
    dataIndex: "applicationDate",
    key: "applicationDate",
    width: "15%",
    sorter: true,
    sortDirections: ["descend", "ascend"],
  },
  { title: "申請者", dataIndex: "applicant", key: "applicant", width: "20%" },
  { title: "申請書種別", dataIndex: "type", key: "type", width: "20%" },
  { title: "申請タイトル", dataIndex: "title", key: "title", width: "45%" },
];

const approvalSortOrder = ref<SortOrder>(null);

const handleApprovalTableChange = (
  pag: unknown,
  filters: unknown,
  sorter: TableSorter | TableSorter[],
) => {
  const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;
  approvalSortOrder.value = sorterObj?.order || null;
};

const getTooltipText = (order: string | null) => {
  if (order === "descend") return "Click to sort ascending";
  if (order === "ascend") return "Cancel sorting";
  return "Click to sort descending";
};

const goToApprovalTasks = () => {
  router.push("/approved-tasks");
};
</script>

<template>
  <a-card :bordered="false" class="w-full shadow-sm custom-card mb-10">
    <template #title>
      <span class="text-[1.8rem] font-bold text-[#333333]">承認タスク</span>
    </template>

    <section class="flex flex-col mt-4">
      <a-table
        :columns="approvalTaskColumns"
        :data-source="[]"
        :pagination="false"
        :showSorterTooltip="false"
        @change="handleApprovalTableChange"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'applicationDate'">
            <div class="flex items-center gap-1.5">
              <span>{{ column.title }}</span>
              <a-tooltip
                :title="getTooltipText(approvalSortOrder)"
                placement="top"
              >
                <div class="flex items-center cursor-pointer">
                  <svg
                    v-if="approvalSortOrder === 'descend'"
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
          @click="goToApprovalTasks"
        >
          <span class="mr-1.5">承認依頼一覧</span>
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
