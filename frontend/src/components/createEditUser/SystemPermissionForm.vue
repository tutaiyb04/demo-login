<script setup lang="ts">
import type { UserFormState } from "@/types/user";

defineProps<{
  formState: UserFormState;
  roleOptions: { value: string; label: string }[];
}>();
</script>

<template>
  <div class="mb-10">
    <h3
      class="text-[1.6rem] !font-bold text-[#333] mb-6 pb-2 border-b border-gray-200"
    >
      システム権限設定
    </h3>

    <div class="px-4 flex flex-col gap-6">
      <a-form-item class="mb-0">
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">権限</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <a-select
          v-model:value="formState.role"
          :options="roleOptions"
          placeholder="権限を選択してください"
          class="h-[40px] !w-[405px] max-w-full"
        />
      </a-form-item>

      <a-form-item class="mb-0">
        <template #label
          ><span class="!font-bold text-[1.6rem]">承認権限</span></template
        >
        <a-checkbox v-model:checked="formState.isApproval">
          承認者に設定する
        </a-checkbox>
      </a-form-item>

      <a-form-item class="mb-0">
        <template #label
          ><span class="!font-bold text-[1.6rem]">代理権限</span></template
        >
        <div class="flex flex-col gap-3">
          <a-checkbox v-model:checked="formState.canProxyApply">
            所属部署スタッフの代理申請を可能にする
          </a-checkbox>
          <a-checkbox v-model:checked="formState.canProxyApprove">
            所属部署スタッフの代理承認を可能にする
          </a-checkbox>
        </div>
      </a-form-item>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-form-item-label > label) {
  color: #555555;
  font-size: 1.4rem;
}
:deep(.ant-form-item-required::before) {
  color: #ff4d4f !important;
}
:deep(.ant-radio-wrapper),
:deep(.ant-checkbox-wrapper) {
  font-size: 1.4rem;
  color: #333333;
}
</style>
