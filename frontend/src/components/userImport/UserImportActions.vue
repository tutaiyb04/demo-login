<script setup lang="ts">
defineProps<{
  isSubmitDisabled: boolean;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "preview"): void;
  (e: "upload"): void;
}>();
</script>

<template>
  <div class="flex justify-center items-center gap-6 mt-16 mb-4">
    <a-button
      size="large"
      class="!h-[44px] !w-[160px] rounded !font-bold !text-[1.4rem] !border-[#0072c6] !text-[#0072c6] hover:!bg-[#f0f8ff]"
      :disabled="disabled"
      @click="emit('cancel')"
    >
      キャンセル
    </a-button>
    <a-button
      size="large"
      type="primary"
      :disabled="isSubmitDisabled || disabled"
      :class="
        isSubmitDisabled || disabled
          ? '!h-[44px] !w-[160px] rounded !font-bold !text-[1.4rem] !bg-[#d8d8d8] !border-[#d8d8d8] !text-white shadow-none'
          : '!h-[44px] !w-[160px] rounded !font-bold !text-[1.4rem] !bg-[#0072c6] !border-[#0072c6] hover:!bg-[#40a9ff] shadow-none'
      "
      @click="emit('preview')"
    >
      プレビュー
    </a-button>
    <a-button
      size="large"
      type="primary"
      :disabled="isSubmitDisabled || disabled"
      :class="
        isSubmitDisabled || disabled
          ? '!h-[44px] !w-[160px] rounded !font-bold !text-[1.4rem] !bg-[#d8d8d8] !border-[#d8d8d8] !text-white shadow-none'
          : '!h-[44px] !w-[160px] rounded !font-bold !text-[1.4rem] !bg-[#0072c6] !border-[#0072c6] hover:!bg-[#40a9ff] shadow-none'
      "
      @click="emit('upload')"
    >
      アップロード
    </a-button>
  </div>
</template>
