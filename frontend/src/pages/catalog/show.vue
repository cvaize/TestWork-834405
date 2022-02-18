<template>
  <AppLayout>
    <div class="container">
      <breadcrumbs-list>
        <breadcrumb-item>
          <router-link to="/"> Главная </router-link>
        </breadcrumb-item>
        <breadcrumb-item>
          <router-link to="/catalog"> Каталог </router-link>
        </breadcrumb-item>
        <breadcrumb-item active> Программа </breadcrumb-item>
      </breadcrumbs-list>
      <div class="flex flex-wrap -mx-4">
        <div class="px-4 w-full xs:max-w-[300px] mb-4">
          <div class="relative before:block before:pt-[100%]">
            <img
              class="absolute inset-0 w-full h-full object-center object-cover rounded-lg"
              src="../../assets/product.jpg"
              alt="Программа"
            />
          </div>
        </div>
        <div class="px-4 w-full xs:max-w-[calc(100%-300px)]">
          <h1 class="text-xl mb-4">Программа</h1>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import AppLayout from "@/layouts/App.vue";
import BreadcrumbsList from "@/components/Breadcrumbs/List.vue";
import BreadcrumbItem from "@/components/Breadcrumbs/Item.vue";

onMounted(() => {
  document.title = "Программа медицинского образования";
});
</script>
