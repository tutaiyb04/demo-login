<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import type { UserRecord } from "@/types/user";
import UserSearchForm from "@/components/userList/UserSearchForm.vue";
import UserTable from "@/components/userList/UserTable.vue";
import api from "@/utils/axios";
import { message } from "ant-design-vue";

const router = useRouter();

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const searchQuery = ref<string>("");
const searchResultsCount = ref<number>(0);

const dataSource = ref<UserRecord[]>([]);

const fetchUsers = async () => {
  try {
    const response = await api.get("/users", {
      params: { page: currentPage.value, perPage: pageSize.value },
    });

    dataSource.value = response.data.items;
    total.value = response.data.total;
    searchResultsCount.value = response.data.total;
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    message.error(
      "Lỗi tải dữ liệu. Có thể Token đã hết hạn, vui lòng đăng nhập lại!",
    );
  }
};

onMounted(() => {
  fetchUsers();
});

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

const handleDeleteUser = async (userCode: string) => {
  if (confirm("Bạn có chắc chắn muốn xóa user này?")) {
    try {
      await api.delete(`/users/${userCode}`);
      message.success("ユーザーの削除に成功しました");

      if (dataSource.value.length === 1 && currentPage.value > 1) {
        currentPage.value -= 1;
      }

      await fetchUsers();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      message.error("ユーザー削除時にエラーが発生しました");
    }
  }
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
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @pageChange="
        (p, ps) => {
          currentPage = p;
          pageSize = ps;
          fetchUsers();
        }
      "
      @edit="handleEditUser"
      @delete="handleDeleteUser"
    />
  </section>
</template>
