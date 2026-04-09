<script setup lang="ts">
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import type { UserRecord } from "@/types/user";
import {
  Empty,
  type TableColumnsType,
  type TablePaginationConfig,
} from "ant-design-vue";

defineProps<{
  dataSource: UserRecord[];
  currentPage: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: "edit", userCode: string): void;
  (e: "delete", userCode: string): void;
  (e: "pageChange", current: number, pageSize: number): void;
}>();

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const handleTableChange = (pagination: TablePaginationConfig) => {
  emit("pageChange", pagination.current || 1, pagination.pageSize || 10);
};

const columns: TableColumnsType = [
  { title: "ユーザーID", dataIndex: "userId", key: "userId", width: 140 },
  { title: "苗字", dataIndex: "lastName", key: "lastName", width: 120 },
  {
    title: "仮名苗字",
    dataIndex: "lastNameKana",
    key: "lastNameKana",
    width: 120,
  },
  { title: "名前", dataIndex: "name", key: "name", width: 120 },
  { title: "仮名名前", dataIndex: "nameKana", key: "nameKana", width: 120 },
  {
    title: "部署コード",
    dataIndex: "departmentCode",
    key: "departmentCode",
    width: 130,
  },
  {
    title: "部署名",
    dataIndex: "departmentName",
    key: "departmentName",
    width: 180,
  },
  { title: "役割コード", dataIndex: "roleCode", key: "roleCode", width: 130 },
  { title: "役割名", dataIndex: "roleName", key: "roleName", width: 130 },
  { title: "メールアドレス", dataIndex: "email", key: "email", width: 250 },
  {
    title: "スタッフコード",
    dataIndex: "staffCode",
    key: "staffCode",
    width: 140,
  },
  { title: "備考", dataIndex: "remarks", key: "remarks", width: 180 },
  {
    title: "最終ログイン",
    dataIndex: "lastLogin",
    key: "lastLogin",
    width: 180,
  },
  { key: "action", width: 100, align: "center" },
];
</script>
<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="{
      current: currentPage,
      pageSize: pageSize,
      total: total,
      showSizeChanger: false,
      position: ['bottomCenter'],
    }"
    :scroll="{ x: 'max-content' }"
    @change="handleTableChange"
  >
    <template
      #bodyCell="{ column, record }: { column: any; record: UserRecord }"
    >
      <template v-if="column.key === 'action'">
        <div class="flex items-center gap-4 text-[1.8rem]">
          <EditOutlined
            class="!text-[#0072c6] hover:!text-[#40a9ff] cursor-pointer transition-colors"
            title="編集"
            @click="emit('edit', record.userCode)"
          />
          <DeleteOutlined
            class="!text-[#0072c6] hover:!text-[#0072c6] cursor-pointer transition-colors"
            title="削除"
            @click="emit('delete', record.userCode)"
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
</template>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #ececec !important;
  color: #333333;
  font-weight: 700;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0 !important;
  padding: 5px 16px !important;
}

:deep(.ant-table-thead > tr > th::before) {
  display: block !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 14px 16px !important;
  white-space: nowrap;
}

:deep(.ant-table-placeholder) {
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.ant-pagination) {
  margin-top: 24px !important;
}

:deep(.ant-pagination-item),
:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  background-color: transparent !important;
}

:deep(.ant-pagination-item a) {
  color: #0072c6 !important;
  font-weight: 700;
}

:deep(.ant-pagination-item) {
  border-radius: 50%;
}

:deep(.ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  color: #0072c6 !important;
}

:deep(.ant-pagination-prev .ant-pagination-item-link),
:deep(.ant-pagination-next .ant-pagination-item-link) {
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

:deep(.ant-pagination-prev),
:deep(.ant-pagination-next) {
  display: inline-flex;
  align-items: center;
}

:deep(.ant-pagination-item-active) {
  background-color: #0072c6 !important;
  border-color: #0072c6 !important;
  font-weight: 700;
}

:deep(.ant-pagination-item-active a),
:deep(.ant-pagination-item-active:hover a) {
  color: #ffffff !important;
}

:deep(.ant-pagination-prev.ant-pagination-disabled),
:deep(.ant-pagination-next.ant-pagination-disabled) {
  display: none !important;
}
</style>
