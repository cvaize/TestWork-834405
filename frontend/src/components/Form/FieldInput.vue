<template>
  <input
    class="field"
    @input="$emit('input', $event)"
    :value="value"
    :type="type || 'text'"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
  />
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

defineProps({
  value: String,
  type: String,
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
});
defineEmits(["input"]);
</script>

<style lang="postcss">
.field {
  @apply relative h-[35px] min-h-[35px] text-base px-[0.75rem] text-yankees-blue bg-white rounded border-light-gray w-full block border outline-none focus:border-auro-metal-saurus focus:not-disabled:z-[1];

  &[type="date"]::-webkit-inner-spin-button,
  &[type="date"]::-webkit-calendar-picker-indicator {
    background: transparent;
    margin: 0;
  }

  &:disabled,
  &.disabled {
    @apply opacity-50 pointer-events-none;
  }
}
</style>
