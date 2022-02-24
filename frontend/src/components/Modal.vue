<template>
  <div
    v-if="show"
    class="flex items-start justify-center inset-0 h-full w-full z-50 fixed overflow-auto bg-black bg-opacity-50"
  >
    <div
      ref="refClose"
      class="relative p-6 z-[1] m-auto w-full flex flex-col"
      @click="handleClose"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from "vue";

defineProps({
  show: Boolean,
});
const emit = defineEmits(["close"]);
const refClose = ref<HTMLDivElement | null>(null);
let closeOnBackdrop = true;

function handleClose(e: Event) {
  if (closeOnBackdrop && refClose.value === e.target) {
    emit("close");
  }
}
</script>
