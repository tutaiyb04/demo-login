<script setup lang="ts">
import { DeleteOutlined } from "@ant-design/icons-vue";
import type { ImportRecord } from "@/types/UserImport";

defineProps<{
  dataSource: ImportRecord[];
}>();

const emit = defineEmits<{
  (e: "execute", record: ImportRecord): void;
  (e: "delete", id: string): void;
}>();

const STATUS_COLORS: Record<string, string> = {
  未実施: "#9d9d9d",
  登録中: "#d8d8d8",
  成功: "#05a605",
  失敗: "#f30000",
};

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

const getStatusColor = (status: string) => STATUS_COLORS[status] || "#333333";
const isRowDisabled = (status: string) =>
  ["登録中", "成功", "失敗"].includes(status);
</script>

<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="true"
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'batch'">
        <a-button
          v-if="!isRowDisabled(record.status)"
          type="primary"
          class="!bg-[#0072c6] hover:!bg-[#40a9ff] border-none !text-[1.2rem] h-[28px] px-4 rounded"
          @click="emit('execute', record)"
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
          @click="!isRowDisabled(record.status) && emit('delete', record.id)"
        />
      </template>
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
