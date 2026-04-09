<script setup>
import { ref, computed } from "vue";

// Biến động chứa tên file
const fileName = ref("importuser -OK -1 - ShiftJs 2.csv");

// ĐÃ THÊM THUỘC TÍNH `width` CHO TẤT CẢ CÁC CỘT
const columns = [
  { title: "操作", key: "action", width: 80, align: "left" },
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
  { title: "メールアドレス", dataIndex: "email", key: "email", width: 200 }, // Email cho rộng hẳn ra
  { title: "利用開始日", dataIndex: "startDate", key: "startDate", width: 120 },
  {
    title: "スタッフコード",
    dataIndex: "staffCode",
    key: "staffCode",
    width: 130,
  },
  { title: "備考", dataIndex: "remarks", key: "remarks", width: 150 },
];

const previewData = ref([
  {
    id: 1,
    actionType: "削除",
    userId: "MIZUKI01",
    firstName: "田中",
    kanaFirstName: "タナカ",
    lastName: "一郎",
    kanaLastName: "イチロウ",
    userCategory: "管理者",
    deptCode: "ACFD001",
    roleCode: "ACFP001",
    authId: "ROLENEW",
    email: "na@kaopiz.com",
    startDate: "2026/04/09",
    staffCode: "S001",
    remarks: "-",
  },
  {
    id: 2,
    actionType: "更新",
    userId: "MIZUKI02",
    firstName: "鈴木",
    kanaFirstName: "スズキ",
    lastName: "二郎",
    kanaLastName: "ジロウ",
    userCategory: "一般",
    deptCode: "ACFD002",
    roleCode: "ACFP002",
    authId: "ROLEUSER",
    email: "suzuki@kaopiz.com",
    startDate: "2026/04/10",
    staffCode: "S002",
    remarks: "部署変更",
  },
  {
    id: 3,
    actionType: "消",
    userId: "MIZUKI03",
    firstName: "佐藤",
    kanaFirstName: "サトウ",
    lastName: "三郎",
    kanaLastName: "サブロウ",
    userCategory: "一般",
    deptCode: "ACFD003",
    roleCode: "ACFP003",
    authId: "ROLEUSER",
    email: "sato@kaopiz.com",
    startDate: "2026/04/11",
    staffCode: "S003",
    remarks: "退職予定",
  },
]);

const totalRecords = computed(() => (previewData.value.length > 0 ? 20 : 0));
</script>

<template>
  <div class="p-6 min-h-screen">
    <a-card :bordered="false" class="rounded-lg">
      <template #title>
        <div class="flex justify-between items-center w-full">
          <span class="text-[1.8rem] font-bold text-gray-800">バッチ実行</span>
        </div>
      </template>

      <div
        class="bg-[#f7f7f7] py-5 px-7 mb-4 text-[1.4rem] font-bold text-gray-700 rounded"
      >
        レコード合計: {{ totalRecords }}
      </div>

      <a-table
        class="preview-table text-[14px]"
        :columns="columns"
        :data-source="previewData"
        :scroll="{ x: 'max-content' }"
        :pagination="{ pageSize: 10, position: ['bottomCenter'] }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span class="text-[14px]">
              {{ record.actionType }}
            </span>
          </template>
        </template>
      </a-table>

      <div class="flex justify-center items-center gap-8 mt-10 pt-6">
        <a-button
          size="large"
          class="!h-15 !min-w-[200px] !px-12 !rounded !font-bold text-[1.4rem]! !border-[#0072c6] !text-[#0072c6]"
        >
          戻る
        </a-button>
        <a-button
          type="primary"
          size="large"
          class="!h-15 !min-w-[200px] !px-12 !rounded !font-bold text-[1.4rem]! !bg-[#0072c6] !border-[#0072c6]"
        >
          バッチ実行
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
:deep(.ant-card-head) {
  border-bottom: none !important;
}

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
