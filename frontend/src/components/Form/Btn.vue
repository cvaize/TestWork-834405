<template>
  <component
    :is="is || 'button'"
    class="btn"
    :class="{
      disabled,
      loading,
      'loading-offset': !!loadingDelay,
      ['btn-' + color]: !!color,
    }"
    :type="type"
    :href="href"
    :to="to"
    :target="target"
    :style="`--loading-delay: ${loadingDelay + 'ms'}`"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

defineProps({
  is: String,
  type: String,
  to: String,
  href: String,
  target: String,
  color: String,
  loadingDelay: Number,
  loading: Boolean,
  disabled: Boolean,
});
defineEmits(["click"]);
</script>

<style lang="postcss">
.btn {
  @apply relative transition h-[35px] flex items-center justify-center rounded text-base leading-normal font-normal px-[0.85rem] border-solid border hover:not-disabled:z-[1] cursor-pointer;

  &.loading-offset {
    --loading-delay: 0ms;

    &:after {
      opacity: 0;
      content: "";
      transition-property: opacity;
      transition-delay: var(--loading-delay);
      transition-duration: 150ms;
    }
  }

  &.loading {
    &:after {
      animation: spinAround 0.5s linear infinite;
      border-radius: 50%;
      border-color: transparent transparent currentColor currentColor;
      border-style: solid;
      border-width: 2px;
      content: "";
      display: block;
      height: 1em;
      width: 1em;
      position: absolute;
      left: calc(50% - 0.5em);
      top: calc(50% - 0.5em);
      opacity: 1;
    }

    &.loading-offset {
      transition-delay: var(--loading-delay);
    }
  }

  &:focus {
    @apply z-[1];
    box-shadow: 0 0 0 0.2rem color(theme("colors.cadet-blue-crayola") a(0%));
  }

  &.loading {
    color: transparent !important;

    &:after {
      border-color: transparent transparent white white;
      height: 1.4em;
      width: 1.4em;
      left: calc(50% - 0.7em);
      top: calc(50% - 0.7em);
    }
  }

  &:disabled,
  &.disabled {
    @apply pointer-events-none text-opacity-50 bg-opacity-50;
  }
}

.btn-white-cadet-blue-crayola {
  @apply bg-white text-yankees-blue border-light-gray hover:not-disabled:text-white hover:not-disabled:border-cadet-blue-crayola hover:not-disabled:bg-cadet-blue-crayola is-active:not-disabled:text-white is-active:not-disabled:border-cadet-blue-crayola is-active:not-disabled:bg-cadet-blue-crayola;

  box-shadow: inset 0 0 0 rgb(0 0 0 / 30%);

  &.active {
    box-shadow: inset 0 3px 6px rgb(0 0 0 / 30%);
  }

  &.loading {
    &:after {
      @apply border-b-eerie-black border-l-eerie-black;
    }
  }
}

.btn-auro-metal-saurus-black-coral {
  @apply bg-white text-white border-auro-metal-saurus bg-auro-metal-saurus hover:not-disabled:text-white hover:not-disabled:border-black-coral hover:not-disabled:bg-black-coral is-active:not-disabled:text-white is-active:not-disabled:border-black-coral is-active:not-disabled:bg-black-coral;

  box-shadow: inset 0 0 0 rgb(0 0 0 / 30%);

  &.active {
    box-shadow: inset 0 3px 6px rgb(0 0 0 / 30%);
  }

  &.loading {
    &:after {
      @apply border-b-white border-l-white;
    }
  }
}

.btn-apple-may-green {
  @apply bg-apple text-white border-apple hover:not-disabled:text-white hover:not-disabled:border-may-green hover:not-disabled:bg-may-green is-active:not-disabled:text-white is-active:not-disabled:border-may-green is-active:not-disabled:bg-may-green;

  box-shadow: inset 0 0 0 rgb(0 0 0 / 20%);

  &.active {
    box-shadow: inset 0 3px 6px rgb(0 0 0 / 20%);
  }
}

.btn-pastel-red-sunset-orange {
  @apply bg-pastel-red text-white border-pastel-red hover:not-disabled:text-white hover:not-disabled:border-sunset-orange hover:not-disabled:bg-sunset-orange is-active:not-disabled:text-white is-active:not-disabled:border-sunset-orange is-active:not-disabled:bg-sunset-orange;

  box-shadow: inset 0 0 0 rgb(0 0 0 / 20%);

  &.active {
    box-shadow: inset 0 3px 6px rgb(0 0 0 / 20%);
  }
}

.btn-blueberry-white {
  @apply bg-blueberry text-white border-blueberry hover:not-disabled:text-white hover:not-disabled:border-blueberry hover:not-disabled:bg-blueberry is-active:not-disabled:text-white is-active:not-disabled:border-blueberry is-active:not-disabled:bg-blueberry;

  box-shadow: inset 0 0 0 rgb(0 0 0 / 20%);

  &.active {
    box-shadow: inset 0 3px 6px rgb(0 0 0 / 20%);
  }
}
</style>
