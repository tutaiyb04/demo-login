<script setup lang="ts">
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { Empty } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

interface UserRecord {
  key: string;
  userCode: string;
  lastName: string;
  firstName: string;
  name: string;
  nameKana: string;
  departmentCode: string;
  manager: string;
  searchCode: string;
  usage: string;
  email: string;
  staffCode: string;
  otherName: string;
  lastLogin: string;
}

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const router = useRouter();

const searchQuery = ref<string>("");
const searchResultsCount = ref<number>(0);

const dataSource = ref<UserRecord[]>([]);

const isSearchDisabled = computed<boolean>(() => {
  return searchQuery.value.trim().length === 0;
});

const handleSearch = () => {
  if (isSearchDisabled.value) return;
  console.log("Tiến hành tìm kiếm với từ khóa:", searchQuery.value);
};

const handleRegister = () => {
  router.push("/user-new");
};

const columns: TableColumnsType = [
  {
    title: "ユーザーコード",
    dataIndex: "userCode",
    key: "userCode",
    width: 140,
  },
  { title: "姓字", dataIndex: "lastName", key: "lastName", width: 100 },
  { title: "名字", dataIndex: "firstName", key: "firstName", width: 100 },
  { title: "名前", dataIndex: "name", key: "name", width: 140 },
  { title: "姓名カナ", dataIndex: "nameKana", key: "nameKana", width: 160 },
  {
    title: "部署コード",
    dataIndex: "departmentCode",
    key: "departmentCode",
    width: 130,
  },
  { title: "管理者", dataIndex: "manager", key: "manager", width: 100 },
  {
    title: "検索コード",
    dataIndex: "searchCode",
    key: "searchCode",
    width: 130,
  },
  { title: "使用先", dataIndex: "usage", key: "usage", width: 130 },
  { title: "メールアドレス", dataIndex: "email", key: "email", width: 250 },
  {
    title: "スタッフコード",
    dataIndex: "staffCode",
    key: "staffCode",
    width: 140,
  },
  { title: "他名", dataIndex: "otherName", key: "otherName", width: 100 },
  {
    title: "最終ログイン",
    dataIndex: "lastLogin",
    key: "lastLogin",
    width: 180,
  },
  { key: "action", width: 100, fixed: "right" },
];
</script>

<template>
  <section class="bg-white p-8 rounded-sm shadow-sm m-5">
    <h2 class="text-[1.8rem] !font-bold text-[#333333] mb-6">組織マスタ管理</h2>

    <div class="flex gap-4 mb-4">
      <a-input
        v-model:value="searchQuery"
        placeholder="会社コードを入力してください"
        class="flex-1 h-[44px] !text-[1.6rem]"
        @pressEnter="handleSearch"
      />
      <a-button
        type="primary"
        class="w-[100px] !h-[44px] p-0 flex items-center justify-center !text-[1.6rem] search-btn shadow-none"
        :disabled="isSearchDisabled"
        @click="handleSearch"
      >
        <div class="flex items-center justify-center gap-1.5 mt-[2px]">
          <SearchOutlined class="text-[2rem] flex items-center" />
          <span class="leading-none flex items-center">検索</span>
        </div>
      </a-button>
    </div>

    <div class="flex justify-end mb-8">
      <a-button
        type="primary"
        class="h-[40px] w-[144px] text-[1.4rem] !bg-[#0072c6] hover:!bg-[#40a9ff] border-none shadow-none"
        @click="handleRegister"
      >
        登録する
      </a-button>
    </div>

    <div class="text-[1.4rem] text-[#333333] mb-4 font-medium">
      検索結果：{{ searchResultsCount }}件
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
      class="custom-table"
    >
      <template
        #bodyCell="{ column, record }: { column: any; record: UserRecord }"
      >
        <template v-if="column.key === 'action'">
          <div class="flex items-center gap-4 text-[1.8rem]">
            <EditOutlined
              class="text-[#1890ff] hover:text-[#40a9ff] cursor-pointer transition-colors"
              title="編集"
              @click="
                router.push({
                  path: '/user-new',
                  query: { id: record.userCode },
                })
              "
            />
            <DeleteOutlined
              class="text-[#ff4d4f] hover:text-[#ff7875] cursor-pointer transition-colors"
              title="削除"
            />
          </div>
        </template>
      </template>

      <template #emptyText>
        <div class="my-10">
          <a-empty :image="simpleImage" description="No data" />
        </div>
      </template>
    </a-table>
  </section>
</template>

<style scoped>
.search-btn:disabled {
  background-color: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.25) !important;
}
.search-btn:not(:disabled) {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #333333;
  font-weight: 700;
  padding: 14px 16px !important;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0 !important;
}
:deep(.ant-table-thead > tr > th::before) {
  display: none !important;
}
:deep(.ant-table-tbody > tr > td) {
  padding: 14px 16px !important;
  white-space: nowrap;
}
:deep(.ant-table-placeholder) {
  border-bottom: 1px solid #f0f0f0 !important;
}
</style>
