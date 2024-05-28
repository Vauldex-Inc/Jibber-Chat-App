<template>
  <button
    @click="emits('click')"
    :class="[sizeClass]"
    class="transition-all capitalize"
    :type="action ? action : 'button'"
  >
    <slot/>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Create a util
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "py-2 px-4 text-sm";
    case "md":
      return "py-3 px-5 text-base";
    case "lg":
      return "py-4 px-6 text-lg";
    default:
      return "py-3 px-5 text-base";
  }
});

interface ButtonProps {
  size?: "sm" | "md" | "lg";
  action?: "submit" | "button";
}

const props = defineProps<ButtonProps>();

// use the succint syntax
const emits = defineEmits<{
  click: [];
}>();
</script>
