<template>
  <div
    class="min-h-screen flex flex-col relative antialiased font-sans text-base font-feature-settings-num-on bg-anti-flash-white text-yankees-blue leading-normal"
  >
    <header
      class="flex-shrink-0 w-full border-b border-b-cadet-blue-crayola border-opacity-30 mb-4"
    >
      <div class="container py-2 pb-4">
        <ul class="list-none flex flex-wrap -mx-2">
          <li v-for="(item, key) in menu" :key="key" class="block">
            <router-link
              :to="item.to"
              class="p-2 text-black text-opacity-50 hover:text-opacity-80 block"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </header>
    <main class="flex-1 w-full flex flex-col">
      <slot />
    </main>
    <footer class="flex-shrink-0 w-full">
      <div class="pb-4 pt-6 container">
        <div class="flex justify-between flex-wrap -mx-4 text-sm">
          <div class="w-full max-w-[17rem] px-4 py-2">
            © «Тестовое задание» {{ year }}
          </div>
          <div class="w-full max-w-[32rem] px-4 py-2">
            Справочная служба
            <a class="simple-link" href="tel:89998887766">8 999 888-77-66</a>
            <br />
            Техническая поддержка
            <a class="simple-link" href="tel:+78887776633"
              >+7 (888) 777-66-33</a
            >
          </div>
          <div class="w-full max-w-[14rem] px-4 py-2">
            Система разработана
            <br />
            в качестве тестового задания
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppLayout",
  setup() {
    const menu = [
      {
        label: "Главная",
        to: "/",
      },
      {
        label: "Каталог",
        to: "/catalog",
      },
    ];
    let year = new window.Date().getFullYear();

    return { menu, year };
  },
});
</script>
