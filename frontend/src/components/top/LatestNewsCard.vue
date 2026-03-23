<script setup lang="ts">
import type { NewsItem } from "@/types/top";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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

const goToAllNews = () => {
  router.push("/latest-news");
};

const goToNewsDetail = (id: number) => {
  router.push(`/latest-news/${id}`);
};
</script>

<template>
  <a-card :bordered="false" class="w-full shadow-sm custom-card">
    <template #title>
      <span class="text-[2rem] font-bold text-[#333333]">最新のお知らせ</span>
    </template>

    <section class="flex flex-col mt-2">
      <div
        v-for="(news, index) in newList"
        :key="news.id"
        class="flex items-center py-10 cursor-pointer hover:bg-gray-50 transition-colors group"
        :class="index !== newList.length - 1 ? 'border-b border-gray-100' : ''"
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
</template>
