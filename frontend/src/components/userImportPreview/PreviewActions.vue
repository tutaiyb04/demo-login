<script setup lang="ts">
const emit = defineEmits<{
  (e: "back"): void;
  (e: "execute"): void;
}>();
</script>

<template>
  <div class="flex justify-center items-center gap-8 mt-10 pt-6">
    <a-button
      size="large"
      class="!h-15 !min-w-[200px] !px-12 !rounded !font-bold !text-[1.4rem] !border-[#0072c6] !text-[#0072c6]"
      @click="emit('back')"
    >
      戻る
    </a-button>
    <a-button
      type="primary"
      size="large"
      class="!h-15 !min-w-[200px] !px-12 !rounded !font-bold !text-[1.4rem] !bg-[#0072c6] !border-[#0072c6]"
      @click="emit('execute')"
    >
      バッチ実行
    </a-button>
  </div>
</template>
