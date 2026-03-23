<script setup lang="ts">
import dayjs from "dayjs";
import BasicInfoForm from "@/components/createEditUser/BasicInfoForm.vue";
import SystemPermissionForm from "@/components/createEditUser/SystemPermissionForm.vue";
import { useLoading } from "@/composables/useLoading";
import type { UserFormState } from "@/types/user";
import { message } from "ant-design-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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
      if (id === "U001") {
        formState.userId = "U001";
        formState.lastName = "Nguyễn";
        formState.firstName = "Văn A";
        formState.lastNameKana = "グエン";
        formState.firstNameKana = "ヴァン A";
        formState.departmentCode = "D01";
        formState.positionCode = "P01";
        formState.email = "nguyenvana@example.com";
        formState.startDate = dayjs("2025-01-01");
        formState.staffCode = "EMP-001";
        formState.remarks = "Nhân viên xuất sắc";
        formState.role = "R01";
        formState.isApprover = true;
        formState.canProxyApply = false;
        formState.canProxyApprove = true;
      } else if (id === "U002") {
        formState.userId = "U002";
        formState.lastName = "Trần";
        formState.firstName = "Thị B";
        formState.lastNameKana = "チャン";
        formState.firstNameKana = "ティ B";
        formState.email = "tranthib@example.com";
        formState.startDate = dayjs("2026-02-15");
      }

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

    router.push("/users");
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
