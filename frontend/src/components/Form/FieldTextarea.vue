<template>
  <textarea
    class="field"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    @keydown="$emit('keydown', $event)"
    :value="value"
    :rows="rows"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
  />
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

defineProps({
  value: String,
  rows: String,
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
});
defineEmits(["input", "change", "keydown"]);
</script>
