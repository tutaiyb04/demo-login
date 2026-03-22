<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { message } from "ant-design-vue";
import { reactive } from "vue";
import { useLoading } from "@/composables/useLoading";

message.config({
  duration: 10,
  maxCount: 10,
});

const { isLoading, showLoading, hideLoading } = useLoading();

const router = useRouter();

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: "",
  password: "",
  remember: false,
});

const onFinish = (values: FormState) => {
  showLoading();

  setTimeout(() => {
    hideLoading();

    const mockUsername = "tutaiyb2411";
    const mockPassword = "123";

    if (values.username === mockUsername && values.password === mockPassword) {
      localStorage.setItem("loggedInUser", values.username);

      message.success("ログインに成功しました。");
      router.push("/wf-tops");
    } else {
      message.error("ログインIDまたはパスワードが間違っています。");
    }
  }, 1500);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const isSumbitDisabled = computed(() => {
  return !formState.username.trim() || !formState.password.trim();
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <section class="w-[440px] max-w-full">
      <h2 class="text-[2.4rem] !font-bold text-center !mb-10 text-gray-800">
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
          name="username"
          :rules="[
            {
              required: true,
              message: 'ログインIDを入力してください。',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <template #label>
            <span class="text-[1.8rem] !font-bold">メールアドレス</span>
          </template>
          <a-input
            v-model:value="formState.username"
            size="large"
            class="w-full h-[44px]"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[
            {
              required: true,
              message: 'パスワードを入力してください',
              trigger: ['blur', 'change'],
            },
          ]"
          class="!mb-11"
        >
          <template #label>
            <span class="text-[1.8rem] !font-bold">パスワード</span>
          </template>
          <a-input-password
            v-model:value="formState.password"
            size="large"
            class="w-full h-[44px]"
          />
        </a-form-item>

        <a-form-item name="remember" class="mt-3 !mb-5">
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
              :disabled="isSumbitDisabled"
              class="w-[360px] !h-[45px] !text-[1.8rem] !font-bold rounded-sm"
              :class="
                isSumbitDisabled
                  ? '!bg-[#d8d8d8] !border-[#d8d8d8] !text-[#ffffff]'
                  : '!bg-[#3b8ac5] hover:!bg-[#3f87be]'
              "
            >
              ログイン
            </a-button>
          </div>
        </a-form-item>
      </a-form>

      <div class="text-center mt-2">
        <a
          href="#"
          class="text-[1.4rem] text-[#2c7ebd] underline hover:text-[#23689b]"
        >
          パスワードをお忘れの方
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
:deep(.ant-input),
:deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
  border-color: #a1a1a1 !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  box-shadow: 0 0 0 2px rgba(44, 126, 189, 0.2) !important;
  border-color: #cccccc !important;
}

:deep(.ant-input:hover) {
  border-color: #cccccc !important;
}

:deep(.ant-checkbox-inner) {
  width: 24px;
  height: 24px;
  border-color: #2c7ebd;
}

:deep(.ant-form-item-has-error .ant-input),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper) {
  border-color: #ff4d4f !important;
  background-color: #ffdbdb !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
}

:deep(.ant-form-item-has-error .ant-input-affix-wrapper > input.ant-input) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.ant-form-item-explain-error::before) {
  content: "!";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ff4d4f;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
}

:deep(.ant-spin-text) {
  color: #2c7ebd !important;
}

:deep(.ant-spin-dot-item) {
  background-color: #2c7ebd !important;
}

:global(.ant-message-notice-content) {
  padding: 10px 24px !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  background-color: #fff !important;
}
</style>
