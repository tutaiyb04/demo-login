<script setup lang="ts">
import { useLoading } from "@/composables/useLoading";
import { Empty, message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const userIdToEdit = computed(() => route.query.id as string | undefined);
const isEditMode = computed(() => !!userIdToEdit.value);
const { isLoading, showLoading, hideLoading } = useLoading();

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

interface UserFormState {
  userId: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  departmentCode: string | null;
  positionCode: string | null;
  email: string;
  startDate: Dayjs | null;
  staffCode: string;
  remarks: string;
  role: string | null;
  isApprover: boolean;
  canProxyApply: boolean;
  canProxyApprove: boolean;
}

const formState = reactive<UserFormState>({
  userId: "",
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  departmentCode: null,
  positionCode: null,
  email: "",
  startDate: null,
  staffCode: "",
  remarks: "",
  role: null,
  isApprover: false,
  canProxyApply: false,
  canProxyApprove: false,
});

const departmentOptions = [{ value: "ACFD001", label: "ACFD001 name" }];

const positionOptions = ref<{ value: string; label: string }[]>([]);

const roleOptions = [
  { value: "admin", label: "管理者" },
  { value: "admin1", label: "管理者1" },
  { value: "admin2", label: "管理者2" },
];

const isSaveDisabled = computed(() => {
  return (
    !formState.userId ||
    !formState.lastName ||
    !formState.firstName ||
    !formState.lastNameKana ||
    !formState.firstNameKana ||
    !formState.departmentCode ||
    !formState.email ||
    !formState.startDate ||
    !formState.staffCode ||
    !formState.remarks ||
    !formState.role
  );
});

const fetchUserData = async (id: string) => {
  showLoading();
  try {
    console.log("Đang lấy dữ liệu cho User ID:", id);

    setTimeout(() => {
      formState.userId = id;
      formState.lastName = "田中";
      formState.firstName = "太郎";
      formState.lastNameKana = "タナカ";
      formState.firstNameKana = "タロウ";
      formState.departmentCode = "ACFD001";
      formState.positionCode = null;
      formState.email = "test@example.com";
      formState.startDate = dayjs("2026-03-01");
      formState.staffCode = "BAITO001";
      formState.remarks = "Đây là ghi chú mẫu";
      formState.role = "admin";
      formState.isApprover = true;
      formState.canProxyApply = true;
      formState.canProxyApprove = false;

      hideLoading();
    }, 500);
  } catch (error) {
    message.error("Lỗi khi tải dữ liệu người dùng!");
    hideLoading();
  }
};

onMounted(() => {
  if (isEditMode.value) {
    fetchUserData(userIdToEdit.value!);
  }
});

const handleSubmit = async () => {
  try {
    // Validate cơ bản (Ant Design Form tự lo phần hiển thị lỗi nếu setup rule, ở đây mình check tay nhanh hoặc dùng a-form rules)
    if (!formState.userId || !formState.lastName || !formState.firstName) {
      message.warning("Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }

    showLoading();
    const payload = {
      ...formState,
      startDate: formState.startDate
        ? formState.startDate.format("YYYY-MM-DD")
        : null,
    };

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isEditMode.value) {
      console.log("Cập nhật dữ liệu:", payload);
      message.success("Cập nhật người dùng thành công!");
    } else {
      console.log("Tạo mới dữ liệu:", payload);
      message.success("Tạo người dùng thành công!");
    }

    router.push("/user-list");
  } catch (error) {
    message.error("Có lỗi xảy ra khi lưu dữ liệu!");
  } finally {
    hideLoading();
  }
};

const handleCancel = () => {
  router.push("/users");
};
</script>
<template>
  <section class="mt-8 mb-5">
    <div class="bg-white rounded-md shadow-sm p-8">
      <a-form layout="vertical" class="user-form">
        <div class="mb-10">
          <h3 class="text-[1.8rem] !font-bold text-[#333] ml-2 mb-6">
            基本情報
          </h3>

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
                  <a-empty
                    :image="simpleImage"
                    description="No data"
                    class="my-4"
                  />
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
                  <span
                    class="bg-[#ff4d4f] text-white text-[1.4rem] px-3 py-0.5 rounded-sm leading-none !font-bold"
                    >必須</span
                  >
                </div>
              </template>
              <a-input
                v-model:value="formState.staffCode"
                placeholder="スタッフコードを入力してください"
                class="h-[40px] !w-[405px] max-w-full"
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
                ><span class="!font-bold text-[1.6rem]"
                  >承認権限</span
                ></template
              >
              <a-checkbox v-model:checked="formState.isApprover">
                承認者に設定する
              </a-checkbox>
            </a-form-item>

            <a-form-item class="mb-0">
              <template #label
                ><span class="!font-bold text-[1.6rem]"
                  >代理権限</span
                ></template
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

        <div class="flex justify-center gap-10 items-center mt-12 pt-6">
          <a-button
            @click="handleCancel"
            class="!h-[48px] !w-[360px] !font-bold text-[1.5rem] bg-white !border-[#0072c6] !text-[#0072c6] shadow-sm"
          >
            キャンセル
          </a-button>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="isLoading"
            :disabled="isSaveDisabled"
            class="!h-[48px] !w-[360px] !font-bold text-[1.5rem] border-none shadow-sm"
            :class="
              isSaveDisabled
                ? '!bg-[#d8d8d8] !border-[#d8d8d8] !text-[#ffffff]'
                : '!bg-[#3b8ac5] hover:!bg-[#3f87be]'
            "
          >
            保存する
          </a-button>
        </div>
      </a-form>
    </div>
  </section>
</template>

<style scoped>
:deep(.ant-form-item-label > label) {
  font-size: 1.4rem;
  color: #333;
  height: auto;
}

:deep(.ant-select-selector) {
  height: 100% !important;
  align-items: center;
}
:deep(.ant-select-selection-search-input) {
  height: 100% !important;
}
</style>
