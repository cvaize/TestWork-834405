<template>
  <div class="btn-group">
    <slot />
  </div>
</template>

<style lang="postcss">
.btn-group {
  @apply flex;

  > .btn {
    &:first-child {
      @apply rounded-r-none;
    }

    &:last-child {
      @apply rounded-l-none;
    }

    &:not(:first-child):not(:last-child) {
      @apply rounded-none;
    }

    &:not(:first-child) {
      margin-left: -1px;
    }
  }
}
</style>
