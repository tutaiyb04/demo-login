<script setup lang="ts">
import AdminHeader from "@/components/adminLayout/AdminHeader.vue";
import AdminSidebar from "@/components/adminLayout/AdminSidebar.vue";
import PageHeader from "@/components/PageHeader.vue";
</script>

<template>
  <a-layout class="h-screen overflow-hidden">
    <AdminHeader />

    <a-layout>
      <AdminSidebar />

      <a-layout-content
        class="!bg-[#f1f7f7] flex flex-col h-full overflow-hidden"
      >
        <PageHeader />

        <div class="overflow-y-auto flex-1 p-6">
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
:deep(.ant-menu-item:hover),
:deep(.ant-menu-submenu-title:hover) {
  background-color: transparent !important;
  color: #ffffff !important;
}

:deep(.ant-menu-submenu-title:hover .ant-menu-submenu-expand-icon) {
  color: #ffffff !important;
}

:deep(.ant-menu-submenu-expand-icon:hover) {
  background-color: transparent !important;
  color: #ffffff !important;
}
</style>
