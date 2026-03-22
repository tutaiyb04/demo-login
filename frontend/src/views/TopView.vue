<script setup lang="ts">
import type { TableColumnsType } from "ant-design-vue";
import { reactive, ref } from "vue"; // Nhớ import ref
import { useRouter } from "vue-router";

const router = useRouter();

interface NewsItem {
  id: number;
  date: string;
  title: string;
}

// 2. Định nghĩa Interface cho dữ liệu bảng My Task
interface TaskRecord {
  key: string;
  status: string;
  type: string;
  title: string;
  approver: string;
  updatedAt: string;
}

// 3. Định nghĩa Interface cho dữ liệu bảng Approval Task
interface ApprovalTaskRecord {
  key: string;
  applicationDate: string;
  applicant: string;
  type: string;
  title: string;
}

// 4. Định nghĩa kiểu dữ liệu cho tham số sorter của Ant Design Table
interface TableSorter {
  column: any;
  columnKey?: string;
  field?: string;
  order?: "ascend" | "descend" | null;
}

const newList = ref<NewsItem[]>([
  {
    id: 1,
    date: "2026/12/19 13:58",
    title: "Date is equalt to Date, difference in Time 4",
  },
  {
    id: 2,
    date: "2026/12/19 14:47",
    title: "Date is equalt to Date, difference in Time 5",
  },
]);

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

const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 50,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "50"],
});

type SortOrder = "ascend" | "descend" | null;

const sortOrder = ref<SortOrder>(null);

const approvalSortOrder = ref<SortOrder>(null);

const handleApprovalTableChange = (
  pag: unknown,
  filters: unknown,
  sorter: TableSorter | TableSorter[],
) => {
  // Đảm bảo lấy đúng object sorter nếu bị trả về mảng
  const sorterObj = Array.isArray(sorter) ? sorter[0] : sorter;
  approvalSortOrder.value = sorterObj?.order || null;
};

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

const goToAllNews = () => {
  router.push("/latest-news");
};

const goToNewsDetail = (id: number) => {
  router.push(`/latest-news/${id}`);
};

const goToAppliedTasks = () => {
  router.push("/completed-applications-list");
};

const goToApprovalTasks = () => {
  router.push("/approved-tasks");
};
</script>

<template>
  <div class="flex flex-col gap-6 mt-18 mx-5">
    <a-card :bordered="false" class="w-full shadow-sm custom-card">
      <template #title>
        <span class="text-[2rem] font-bold text-[#333333]">最新のお知らせ</span>
      </template>

      <section class="flex flex-col mt-2">
        <div
          v-for="(news, index) in newList"
          :key="news.id"
          class="flex items-center py-10 cursor-pointer hover:bg-gray-50 transition-colors group"
          :class="
            index !== newList.length - 1 ? 'border-b border-gray-100' : ''
          "
          @click="goToNewsDetail(news.id)"
        >
          <span class="text-[#888888] text-[1.5rem] w-[160px] -mt-4">{{
            news.date
          }}</span>
          <span class="text-[#333333] text-[1.6rem] font-medium">{{
            news.title
          }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mt-1.5 ml-2 text-gray-900"
          >
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </div>

        <div class="flex justify-end mt-15">
          <div
            class="flex items-center gap-1 text-[#407faf] hover:text-[#23689b] cursor-pointer text-[1.6rem] font-medium transition-colors"
            @click="goToAllNews"
          >
            <span class="mr-1.5">すべてのお知らせを見る</span>
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

    <!-- My Tasks -->
    <div class="mt-4 mb-2">
      <span class="text-[2rem] font-bold text-[#333333]">マイタスク一覧</span>
    </div>

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
  </div>
</template>

<style scoped>
:deep(.custom-card .ant-card-head) {
  padding: 16px 0 0 0;
  border-bottom: none;
}

:deep(.ant-card-head-title) {
  margin: 0 16px 8px 16px;
}

:deep(.custom-card .ant-card-body) {
  padding: 0 24px 24px 24px;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #ebebeb !important;
  color: #333333;
  font-weight: 600;
  border-bottom: none !important;
  padding: 14px 16px !important;
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
