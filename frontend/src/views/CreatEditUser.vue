<script setup lang="ts">
import dayjs from "dayjs";
import BasicInfoForm from "@/components/createEditUser/BasicInfoForm.vue";
import SystemPermissionForm from "@/components/createEditUser/SystemPermissionForm.vue";
import { useLoading } from "@/composables/useLoading";
import type { UserFormState } from "@/types/user";
import { message } from "ant-design-vue";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
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
  isApproval: false,
  canProxyApply: false,
  canProxyApprove: false,
});

const departmentOptions = ref<{ value: string; label: string }[]>([]);
const positionOptions = ref<{ value: string; label: string }[]>([]);
const roleOptions = ref<{ value: string; label: string }[]>([]);
const isLoadingPosition = ref(false);
let isInitialLoad = true;

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

const fetchRoles = async () => {
  try {
    const response = await api.get("/roles");

    roleOptions.value = response.data.map((role: any) => ({
      value: role.RoleCode,
      label: role.RoleName,
    }));
  } catch (error) {
    message.error("Lỗi khi tải danh sách phân quyền");
  }
};

const fetchDepartments = async () => {
  try {
    const response = await api.get("/departments");
    departmentOptions.value = response.data.map((dept: any) => ({
      value: dept.DepartmentCode,
      label: dept.DepartmentName,
    }));
  } catch (error) {
    message.error("Lỗi khi tải danh sách phòng ban");
  }
};

const fetchPositions = async (deptCode: string) => {
  isLoadingPosition.value = true;
  try {
    const response = await api.post("/positions/search-by-departmentCode", {
      DepartmentCode: deptCode,
    });

    positionOptions.value = response.data.map((pos: any) => ({
      value: pos.PositionCode,
      label: pos.PositionName,
    }));
  } catch (error) {
    message.error("Lỗi khi tải danh sách chức vụ");
    positionOptions.value = [];
  } finally {
    isLoadingPosition.value = false;
  }
};

watch(
  () => formState.departmentCode,
  async (newDeptCode, oldDeptCode) => {
    if (newDeptCode) {
      await fetchPositions(newDeptCode);

      // Nếu người dùng chủ động đổi Department (không phải lúc mới load data Edit) -> Reset Position
      if (!isInitialLoad && oldDeptCode !== undefined) {
        formState.positionCode = null;
      }
    } else {
      // Nếu clear Department -> Xóa list Position và reset PositionCode
      positionOptions.value = [];
      formState.positionCode = null;
    }
  },
);

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
    formState.email = user.email;
    formState.startDate = user.startDate ? dayjs(user.startDate) : null;
    formState.staffCode = user.staffCode;
    formState.remarks = user.remarks;
    formState.role = user.roleCode;
    formState.isApproval = !!user.isApproval;
    formState.canProxyApply = !!user.canProxyApply;
    formState.canProxyApprove = !!user.canProxyApprove;

    formState.departmentCode = user.departmentCode;
    if (user.departmentCode) {
      await fetchPositions(user.departmentCode);
    }
    formState.positionCode = user.positionCode || null;

    await nextTick();
    isInitialLoad = false;

    hideLoading();
  } catch (error) {
    message.error("ユーザーデータの読み込み中にエラーが発生しました");
    hideLoading();
  }
};

onMounted(async () => {
  await Promise.all([fetchDepartments(), fetchRoles()]);

  if (isEditMode.value) {
    await fetchUserData(userIdToEdit.value!);
  } else {
    isInitialLoad = false;
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
      isApproval: formState.isApproval,
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
          :is-loading-position="isLoadingPosition"
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
