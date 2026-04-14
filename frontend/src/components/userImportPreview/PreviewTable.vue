<script setup lang="ts">
import type { PreviewRecord } from "@/types/UserImport";
import type { TableColumnType } from "ant-design-vue";
import { computed } from "vue";

type PreviewRow = PreviewRecord | Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    dataSource: PreviewRow[];
    /** When omitted, uses default columns keyed for `PreviewRecord` (English fields). */
    columns?: TableColumnType<PreviewRow>[];
  }>(),
  { columns: undefined },
);

const defaultColumns: TableColumnType<PreviewRow>[] = [
  {
    title: "操作",
    dataIndex: "actionType",
    key: "action",
    width: 80,
    align: "left" as const,
  },
  { title: "ユーザーID", dataIndex: "userId", key: "userId", width: 120 },
  { title: "名前", dataIndex: "firstName", key: "firstName", width: 100 },
  {
    title: "仮名名前",
    dataIndex: "kanaFirstName",
    key: "kanaFirstName",
    width: 120,
  },
  { title: "苗字", dataIndex: "lastName", key: "lastName", width: 100 },
  {
    title: "仮名苗字",
    dataIndex: "kanaLastName",
    key: "kanaLastName",
    width: 120,
  },
  {
    title: "ユーザー分類",
    dataIndex: "userCategory",
    key: "userCategory",
    width: 120,
  },
  { title: "部署コード", dataIndex: "deptCode", key: "deptCode", width: 120 },
  { title: "役割コード", dataIndex: "roleCode", key: "roleCode", width: 120 },
  { title: "権限ID", dataIndex: "authId", key: "authId", width: 120 },
  { title: "メールアドレス", dataIndex: "email", key: "email", width: 200 },
  { title: "利用開始日", dataIndex: "startDate", key: "startDate", width: 120 },
  {
    title: "スタッフコード",
    dataIndex: "staffCode",
    key: "staffCode",
    width: 130,
  },
  { title: "備考", dataIndex: "remarks", key: "remarks", width: 150 },
];

const resolvedColumns = computed(() => props.columns ?? defaultColumns);

const rowKey = (record: PreviewRow, index: number) => {
  const rec = record as any;

  if (rec["ユーザーID"]) {
    return String(rec["ユーザーID"]);
  }
  if (rec.id != null) {
    return String(rec.id);
  }
  return `row-${index}`;
};
</script>

<template>
  <a-table
    class="preview-table text-[14px]"
    :columns="resolvedColumns"
    :data-source="dataSource"
    :scroll="{ x: 'max-content' }"
    :pagination="{ pageSize: 10, position: ['bottomCenter'] }"
    :row-key="rowKey"
  />
</template>

<style scoped>
.preview-table :deep(.ant-table-thead > tr > th) {
  padding: 6px 12px !important;
  line-height: 1.25;
  font-size: inherit;
  font-weight: 700;
  background-color: #ececec !important;
  color: #333;
  border-bottom: 1px solid #f0f0f0 !important;
  white-space: nowrap;
}

.preview-table :deep(.ant-table-thead > tr > th::before) {
  display: block !important;
  background-color: rgba(0, 0, 0, 0.08) !important;
}

.preview-table :deep(.ant-pagination) {
  margin-top: 16px !important;
}

.preview-table :deep(.ant-pagination-item),
.preview-table :deep(.ant-pagination-prev),
.preview-table :deep(.ant-pagination-next) {
  font-size: inherit;
}
</style>
