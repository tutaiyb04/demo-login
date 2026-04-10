<script setup lang="ts">
defineProps<{
  total: number;
}>();
</script>

<template>
  <div
    class="bg-[#f7f7f7] py-5 px-7 mb-4 text-[1.4rem] font-bold text-gray-700 rounded"
  >
    レコード合計: {{ total }}
  </div>
</template>
