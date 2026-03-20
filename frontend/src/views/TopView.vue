<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const newList = [
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
];

const goToAllNews = () => {
  router.push("/latest-news");
};

const goToNewsDetail = (id: number) => {
  router.push(`/latest-news/${id}`);
};
</script>

<template>
  <div class="flex flex-col gap-6 !bg-[#f1f7f7]">
    <a-card :bordered="false" class="w-full shadow-sm custom-card">
      <template #title>
        <span class="text-[2rem] font-blod text-gray-800">最新のお知らせ</span>
      </template>

      <div class="flex flex-col">
        <div
          v-for="news in newList"
          :key="news.id"
          class="flex items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group"
          @click="goToNewsDetail(news.id)"
        >
          <span class="text-gray-400 text-[1.4rem] w-[160px] shrink-0">{{
            news.date
          }}</span>
          <span class="text-gray-700 text-[1.4rem] flex-1">{{
            news.title
          }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-800 group-hover:text-blue-500 transition-colors"
          >
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </div>

        <div class="flex justify-end mt-4">
          <div
            class="flex items-center gap-1 text-[#2c7ebd] hover:text-[#23689b] cursor-pointer text-sm font-medium transition-colors"
            @click="goToAllNews"
          >
            <span>すべてのお知らせを見る</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
      </div>
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
  padding: 0 24px 16px 24px;
}
</style>
