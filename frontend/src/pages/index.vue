<template>
  <AppLayout>
    <div class="container">
      <h1 class="text-xl mt-5">
        Добро пожаловать в магазин программ медицинского образования
      </h1>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import AppLayout from "@/layouts/App.vue";

onMounted(() => {
  document.title = "Магазин программ медицинского образования";
});
</script>
