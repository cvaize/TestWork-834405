<template>
  <AppLayout>
    <div class="container">
      <h1 class="text-xl mb-4 hidden">Каталог</h1>
      <breadcrumbs-list>
        <breadcrumb-item>
          <router-link to="/"> Главная </router-link>
        </breadcrumb-item>
        <breadcrumb-item active> Каталог </breadcrumb-item>
      </breadcrumbs-list>
      <div class="flex flex-wrap -mx-4">
        <div class="px-4 w-full sm:max-w-[300px] mb-4">
          <div class="bg-white rounded-lg">
            <div class="bg-blueberry text-center text-white rounded-t-lg p-4">
              2 программы - {{ cartTotal.toLocaleString("ru-RU") }} ₽
            </div>
            <div class="p-4">
              <div class="mb-2">Программы НМО</div>
              <btn-group>
                <FieldInput value="123" class="rounded-r-none" />
                <btn color="auro-metal-saurus-black-coral">
                  <SearchIcon />
                </btn>
              </btn-group>
            </div>
          </div>
          <div class="bg-white rounded-lg mt-4 p-4">
            <div class="mb-2 font-bold">Категории</div>
            <btn
              class="block w-full text-left group rounded-b-none rounded-t after-group:rounded-b after-group:rounded-t-none"
              color="auro-metal-saurus-black-coral"
            >
              Все категории
            </btn>
            <btn
              class="block w-full text-left bg-white text-auro-metal-saurus group rounded-none after-group:rounded-b after-group:rounded-t-none"
              color="auro-metal-saurus-black-coral"
            >
              Все категории
            </btn>
          </div>
        </div>
        <div class="px-4 w-full sm:max-w-[calc(100%-300px)]">
          <div class="-mx-4 flex flex-wrap">
            <div
              class="px-4 mb-4 w-full max-w-[100%] lg:max-w-[50%] xl:max-w-[33.3333%] xxl:max-w-[25%]"
            >
              <div class="relative before:block before:pt-[100%]">
                <img
                  class="absolute inset-0 w-full h-full object-center object-cover rounded-t-lg"
                  src="../../assets/product.jpg"
                  alt="Программа"
                />
              </div>
              <div
                class="border-l border-r border-b border-block rounded-b-lg py-4 px-2 flex flex-col"
              >
                <div class="flex w-full mb-auth">
                  <div class="font-bold">Программа HMO</div>
                  <div class="whitespace-nowrap ml-auto pl-2">
                    {{ cartTotal.toLocaleString("ru-RU") }} ₽
                  </div>
                </div>
                <div class="w-full mt-4 flex">
                  <btn class="bg-blueberry text-white border-blueberry mr-auto">
                    В корзину
                  </btn>
                  <btn is="router-link" to="/catalog/123"> Подробнее </btn>
                </div>
              </div>
            </div>
          </div>
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
import FieldInput from "@/components/Form/FieldInput.vue";
import Btn from "@/components/Form/Btn.vue";
import SearchIcon from "@/components/Icons/SearchIcon.vue";
import BtnGroup from "@/components/Form/BtnGroup.vue";

onMounted(() => {
  document.title = "Каталог программ медицинского образования";
});

const cartTotal = 20022;
</script>
