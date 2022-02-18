<template>
  <span class="svg-icon">
    <slot></slot>
  </span>
</template>

<style lang="postcss">
.svg-icon svg {
  width: 1em;
  height: 1em;
  overflow: hidden;
  display: inline-block;
  flex-shrink: 0;
  pointer-events: none;
  fill: currentColor;
  stroke: currentColor;
  vertical-align: -0.15em;
}
</style>
