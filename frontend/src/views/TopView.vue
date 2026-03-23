<script setup lang="ts">
import ApprovalTasksCard from "@/components/top/ApprovalTasksCard.vue";
import LatestNewsCard from "@/components/top/LatestNewsCard.vue";
import MyTasksCard from "@/components/top/MyTasksCard.vue";
</script>

<template>
  <div class="flex flex-col gap-6 mt-18 mx-5">
    <LatestNewsCard />

    <div class="mt-4 mb-2">
      <span class="text-[2rem] font-bold text-[#333333]">マイタスク一覧</span>
    </div>

    <MyTasksCard />

    <ApprovalTasksCard />
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
</style>
