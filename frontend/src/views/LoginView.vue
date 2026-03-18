<script setup lang="ts">
import { reactive, ref } from "vue";

const isLoading = ref(false);

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  email: "",
  password: "",
  remember: false,
});

const onFinish = (values: FormState) => {
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    alert(`Đăng nhập thành công với user: ${formState.email}`);
  }, 1500);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-[440px] max-w-full">
      <h2 class="text-[24px] font-bold text-center !mb-10 text-gray-800">
        ACF Baas Workflow
      </h2>

      <a-form
        :model="formState"
        layout="vertical"
        autocomplete="off"
        :hideRequiredMark="true"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="email"
          :rules="[
            {
              required: true,
              message: 'メールアドレスを入力してください',
              trigger: 'blur',
            },
          ]"
        >
          <template #label>
            <span class="text-[18px] !font-bold">メールアドレス</span>
          </template>
          <a-input
            v-model:value="formState.email"
            size="large"
            class="w-full"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[
            {
              required: true,
              message: 'パスワードを入力してください',
              trigger: 'blur',
            },
          ]"
        >
          <template #label>
            <span class="text-[18px] !font-bold">パスワード</span>
          </template>
          <a-input-password
            v-model:value="formState.password"
            size="large"
            class="w-full"
          />
        </a-form-item>

        <a-form-item name="remember" class="mt-2 mb-6">
          <div class="flex justify-center">
            <a-checkbox v-model:checked="formState.remember">
              <span class="text-sm text-gray-600">ログイン情報を保持する</span>
            </a-checkbox>
          </div>
        </a-form-item>

        <a-form-item class="mb-4">
          <div class="flex justify-center">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="isLoading"
              class="w-[360px] h-[42px] text-[18px] !font-bold rounded !bg-[#3b8ac5] hover:!bg-[#3f87be]"
            >
              ログイン
            </a-button>
          </div>
        </a-form-item>
      </a-form>

      <div class="text-center mt-2">
        <a
          href="#"
          class="text-sm text-[#2c7ebd] hover:underline hover:text-[#23689b]"
        >
          パスワードをお忘れの方
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-input),
:deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

:deep(.ant-input:focus),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  box-shadow: none !important;
  border-color: #2c7ebd !important;
}
</style>
