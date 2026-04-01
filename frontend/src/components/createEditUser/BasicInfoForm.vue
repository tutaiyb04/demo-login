<script setup lang="ts">
import type { UserFormState } from "@/types/user";
import { Empty } from "ant-design-vue";

defineProps<{
  formState: UserFormState;
  isEditMode: boolean;
  departmentOptions: { value: string; label: string }[];
  positionOptions: { value: string; label: string }[];
}>();

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
</script>

<template>
  <div class="mb-10">
    <h3 class="text-[1.8rem] !font-bold text-[#333] ml-2 mb-6">基本情報</h3>

    <div class="px-4 flex flex-col">
      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">ユーザーID</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <a-input
          v-model:value="formState.userId"
          placeholder="ユーザーIDを入力してください"
          class="!h-[40px] !w-[405px] max-w-full"
          :disabled="isEditMode"
        />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">ユーザ名</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <div class="flex gap-4">
          <a-input
            v-model:value="formState.lastName"
            placeholder="苗字を入力してください"
            class="h-[40px] !w-[405px] max-w-full"
          />
          <a-input
            v-model:value="formState.firstName"
            placeholder="名前を入力してください"
            class="h-[40px] !w-[405px] max-w-full"
          />
        </div>
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">読み仮名</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <div class="flex gap-4">
          <a-input
            v-model:value="formState.lastNameKana"
            placeholder="苗字の読みをカタカナで入力"
            class="h-[40px] !w-[405px] max-w-full"
          />
          <a-input
            v-model:value="formState.firstNameKana"
            placeholder="名前の読みをカタカナで入力"
            class="h-[40px] !w-[405px] max-w-full"
          />
        </div>
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">所属部署</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <a-select
          v-model:value="formState.departmentCode"
          :options="departmentOptions"
          placeholder="所属部署"
          class="h-[40px] !w-[405px] max-w-full"
        />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">役職</span>
          </div>
        </template>
        <a-select
          v-model:value="formState.positionCode"
          :options="positionOptions"
          placeholder="役職"
          class="h-[40px] !w-[405px] max-w-full"
        >
          <template #notFoundContent>
            <a-empty :image="simpleImage" description="No data" class="my-4" />
          </template>
        </a-select>
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">メールアドレス</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <a-input
          v-model:value="formState.email"
          placeholder="メールアドレスを入力してください"
          class="h-[40px] !w-[507px] max-w-full"
        />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">利用開始日</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <a-date-picker
          v-model:value="formState.startDate"
          format="YYYY/MM/DD"
          placeholder="利用開始日を入力してください"
          class="h-[40px] !w-[405px] max-w-full"
        />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">スタッフコード</span>
          </div>
        </template>
        <a-input
          v-model:value="formState.staffCode"
          placeholder="自動発電システム"
          class="h-[40px] !w-[405px] max-w-full"
          disabled
        />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex items-center gap-3">
            <span class="font-bold text-[1.6rem]">備考</span>
            <span
              class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
              >必須</span
            >
          </div>
        </template>
        <a-textarea
          v-model:value="formState.remarks"
          :rows="4"
          placeholder="備考を入力してください"
          class="w-full"
        />
      </a-form-item>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-form-item-label > label) {
  font-size: 1.4rem;
  color: #333;
  height: auto;
}
:deep(.ant-select-selector),
:deep(.ant-select-selection-search-input) {
  height: 100% !important;
  align-items: center;
}
</style>
