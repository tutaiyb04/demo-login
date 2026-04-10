<script setup lang="ts">
defineProps<{
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "download"): void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-10 gap-6">
    <h2 class="text-[1.8rem] !font-bold text-[#333333] m-0">
      ユーザーインポート
    </h2>
    <a-button
      size="large"
      class="!h-[44px] !px-10 !text-[1.5rem] !font-bold rounded !border-[#0072c6] !text-[#0072c6] hover:!bg-[#f0f8ff]"
      :disabled="disabled"
      @click="emit('download')"
    >
      テンプレートファイル
    </a-button>
  </div>
</template>
