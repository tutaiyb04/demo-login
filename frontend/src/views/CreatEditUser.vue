<script setup lang="ts">
import dayjs from "dayjs";
import BasicInfoForm from "@/components/createEditUser/BasicInfoForm.vue";
import SystemPermissionForm from "@/components/createEditUser/SystemPermissionForm.vue";
import { useLoading } from "@/composables/useLoading";
import type { UserFormState } from "@/types/user";
import { message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/axios";

const router = useRouter();
const route = useRoute();
const { isLoading, showLoading, hideLoading } = useLoading();

const userIdToEdit = computed(() => route.query.id as string | undefined);
const isEditMode = computed(() => !!userIdToEdit.value);

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

const departmentOptions = [{ value: "ACFD001", label: "ACFD001" }];
const positionOptions = ref<{ value: string; label: string }[]>([]);
const roleOptions = [
  { value: "管理者", label: "管理者" },
  { value: "管理者1", label: "管理者1" },
  { value: "管理者2", label: "管理者2" },
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
    !formState.remarks ||
    !formState.role
  );
});

const fetchUserData = async (id: string) => {
  showLoading();
  try {
    const response = await api.get(`/users/${id}`);
    const user = response.data;

    formState.userId = user.userCode;
    formState.lastName = user.lastName;
    formState.firstName = user.firstName;
    formState.lastNameKana = user.lastNameKana;
    formState.firstNameKana = user.firstNameKana;
    formState.departmentCode = user.departmentCode;
    formState.positionCode = user.positionCode || null;
    formState.email = user.email;
    formState.startDate = user.startDate ? dayjs(user.startDate) : null;
    formState.staffCode = user.staffCode;
    formState.remarks = user.remarks;
    formState.role = user.roleCode;
    formState.isApprover = !!user.isApprover;
    formState.canProxyApply = !!user.canProxyApply;
    formState.canProxyApprove = !!user.canProxyApprove;

    hideLoading();
  } catch (error) {
    message.error("ユーザーデータの読み込み中にエラーが発生しました");
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
    if (!formState.userId || !formState.lastName || !formState.firstName) {
      message.warning("必須項目はすべてご記入ください。");
      return;
    }

    showLoading();
    const payload = {
      username: formState.userId,
      password: "Abcd@1234",
      email: formState.email,
      name: `${formState.lastName} ${formState.firstName}`.trim(),
      firstName: formState.firstName,
      lastName: formState.lastName,
      lastNameKana: formState.lastNameKana,
      firstNameKana: formState.firstNameKana,
      departmentCode: formState.departmentCode,
      positionCode: formState.positionCode,
      startDate: formState.startDate
        ? formState.startDate.format("YYYY-MM-DD")
        : null,
      staffCode: formState.staffCode,
      remarks: formState.remarks,
      roleCode: formState.role,
      isApprover: formState.isApprover,
      canProxyApply: formState.canProxyApply,
      canProxyApprove: formState.canProxyApprove,
    };

    if (isEditMode.value) {
      await api.patch(`/users/${userIdToEdit.value}`, payload);
      message.success("Cập nhật người dùng thành công!");
    } else {
      await api.post("/users", payload);
      message.success("Tạo người dùng thành công!");
    }

    router.push("/users");
  } catch (error: any) {
    message.error(
      error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!",
    );
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
        <BasicInfoForm
          :form-state="formState"
          :is-edit-mode="isEditMode"
          :department-options="departmentOptions"
          :position-options="positionOptions"
        />

        <SystemPermissionForm
          :form-state="formState"
          :role-options="roleOptions"
        />

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
