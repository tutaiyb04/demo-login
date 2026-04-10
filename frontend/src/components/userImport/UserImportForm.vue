<script setup lang="ts">
import {
  InboxOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import type { UploadProps } from "ant-design-vue";
import type { Department } from "@/types/UserImport";

const props = defineProps<{
  departmentId: string | undefined;
  fileList: any[];
  departmentOptions: Department[];
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update:departmentId", value: string | undefined): void;
  (e: "update:fileList", value: any[]): void;
}>();

const handleDepartmentChange = (val: string) => {
  emit("update:departmentId", val);
};

const handleRemove = () => {
  emit("update:fileList", []);
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (props.disabled) return;
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    emit("update:fileList", [e.dataTransfer.files[0]]);
  }
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  emit("update:fileList", [file]);
  return false; // Ngăn Ant Design tự động upload
};
</script>

<template>
  <div>
    <div class="mb-14">
      <div class="flex items-center mb-3 gap-2">
        <label class="text-[1.4rem] !font-bold text-[#333333]">部署名</label>
        <span
          class="bg-[#ff4d4f] text-white text-[11px] px-[6px] py-[2px] rounded font-bold leading-none"
        >
          必須
        </span>
      </div>
      <a-select
        :value="departmentId"
        :options="departmentOptions"
        placeholder="選択してください"
        class="w-[320px]"
        size="large"
        :disabled="disabled"
        @change="handleDepartmentChange"
      />
    </div>

    <div class="mb-10">
      <div class="flex items-center mb-3 gap-2">
        <label class="text-[1.4rem] font-bold text-[#333333]"
          >ファイルアップロード</label
        >
        <span
          class="bg-[#ff4d4f] text-white text-[11px] px-[6px] py-[2px] rounded font-bold leading-none"
        >
          必須
        </span>
      </div>

      <div class="rounded-md border border-[#d9d9d9] bg-[#ececec]">
        <div
          class="h-[220px] flex flex-col items-center justify-center px-6"
          @dragover.prevent
          @dragenter.prevent
          @drop="handleDrop"
          :class="{ 'opacity-60 pointer-events-none': disabled }"
        >
          <template v-if="!fileList || fileList.length === 0">
            <InboxOutlined class="text-[44px] text-[#b3b3b3] mb-4" />
            <p class="text-[#9b9b9b] text-[1.4rem] m-0">
              ここにファイルをドロップしてアップロード
            </p>
          </template>

          <template v-else>
            <div
              class="flex items-center gap-4 bg-white px-6 py-4 rounded shadow-sm border border-[#e6e6e6]"
            >
              <span
                class="text-[1.6rem] font-medium text-[#333] max-w-[520px] truncate"
                :title="fileList[0].name"
              >
                {{ fileList[0].name }}
              </span>
              <DeleteOutlined
                v-if="!disabled"
                class="text-[1.8rem] text-[#f5222d] cursor-pointer hover:text-[#cf1322] transition-colors"
                @click="handleRemove"
                title="削除"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="px-6 pb-6 mt-4">
        <a-upload
          :fileList="fileList"
          :showUploadList="false"
          :before-upload="beforeUpload"
          :disabled="disabled"
        >
          <button
            type="button"
            class="inline-flex items-center gap-2 !text-[#0072c6] hover:underline text-[1.4rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="disabled"
          >
            ファイルを選択してアップロード
            <UploadOutlined class="text-[1.6rem]" />
          </button>
        </a-upload>
      </div>
    </div>
  </div>
</template>
