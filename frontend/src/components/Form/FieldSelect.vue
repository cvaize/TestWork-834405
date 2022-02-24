<template>
  <select
    class="field"
    :class="{
      disabled,
      loading,
    }"
    :value="value"
    :disabled="disabled"
    @change="$emit('change', $event)"
  >
    <option v-if="placeholder" value="">{{ placeholder }}</option>
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

defineProps({
  value: [String, Number],
  placeholder: String,
  disabled: Boolean,
  loading: Boolean,
  options: Array,
});
defineEmits(["change"]);
</script>
