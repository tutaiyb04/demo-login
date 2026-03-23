<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import type { UserRecord } from "@/types/user";
import UserSearchForm from "@/components/userList/UserSearchForm.vue";
import UserTable from "@/components/userList/UserTable.vue";

const router = useRouter();

const searchQuery = ref<string>("");
const searchResultsCount = ref<number>(2); // Tạm fix cứng bằng độ dài mảng mock

// Mock Data
const dataSource = ref<UserRecord[]>([
  {
    key: "1",
    userCode: "U001",
    lastName: "Nguyễn",
    lastNameKana: "グエン",
    name: "Văn A",
    nameKana: "ヴァン A",
    departmentCode: "D01",
    departmentName: "IT Department",
    roleCode: "R01",
    roleName: "Admin",
    manager: "Trần Văn Sếp",
    searchCode: "S001",
    usage: "Active",
    email: "nguyenvana@example.com",
    staffCode: "EMP-001",
    remarks: "Nhân viên xuất sắc",
    otherName: "A Nguyen",
    lastLogin: "2026/03/23 08:30:00",
  },
  {
    key: "2",
    userCode: "U002",
    lastName: "Trần",
    lastNameKana: "チャン",
    name: "Thị B",
    nameKana: "ティ B",
    departmentCode: "D02",
    departmentName: "HR Department",
    roleCode: "R02",
    roleName: "User",
    manager: "Lê Văn Quản Lý",
    searchCode: "S002",
    usage: "Inactive",
    email: "tranthib@example.com",
    staffCode: "EMP-002",
    remarks: "Nhân viên mới",
    otherName: "B Tran",
    lastLogin: "2026/03/22 17:00:00",
  },
]);

const handleSearch = () => {
  console.log("Tiến hành tìm kiếm với từ khóa:", searchQuery.value);
  // Gọi API ở đây và cập nhật lại dataSource & searchResultsCount
};

const handleRegister = () => {
  router.push("/user-new");
};

const handleEditUser = (userCode: string) => {
  router.push({
    path: "/user-new",
    query: { id: userCode },
  });
};

const handleDeleteUser = (userCode: string) => {
  console.log("Xác nhận xóa user:", userCode);
};
</script>

<template>
  <section class="bg-white p-8 rounded-sm shadow-sm m-5">
    <UserSearchForm v-model:searchQuery="searchQuery" @search="handleSearch" />

    <div class="flex justify-end mb-8">
      <a-button
        type="primary"
        class="h-[40px] w-[144px] text-[1.4rem] !bg-[#0072c6] hover:!bg-[#40a9ff] border-none shadow-none"
        @click="handleRegister"
      >
        登録する
      </a-button>
    </div>

    <div class="text-[1.4rem] text-[#333333] mb-4 font-medium">
      検索結果：{{ searchResultsCount }}件
    </div>

    <UserTable
      :data-source="dataSource"
      @edit="handleEditUser"
      @delete="handleDeleteUser"
    />
  </section>
</template>
