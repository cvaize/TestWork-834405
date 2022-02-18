<template>
  <ol class="breadcrumb">
    <slot />
  </ol>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BreadcrumbsList",
});
</script>

<style lang="postcss">
.breadcrumb {
  @apply flex flex-wrap p-0 mb-4 list-none leading-[1.3];
}
</style>
