<template>
  <li class="breadcrumb-item" :class="{ active }">
    <slot />
  </li>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  active: Boolean,
});
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BreadcrumbItem",
});
</script>

<style lang="postcss">
.breadcrumb-item {
  @apply text-cadet-blue-crayola;

  & + & {
    padding-left: 0.5rem;

    &:before {
      float: left;
      padding-right: 0.5rem;
      color: inherit;
      content: url("data:image/svg+xml;charset=utf-8,%3Csvg width='14' height='20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.667 5.333L9.333 10l-4.666 4.667' stroke='%23C0C4CC'/%3E%3C/svg%3E");
    }
  }

  a {
    @apply hover:underline;
  }
}
</style>
