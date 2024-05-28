<template>
  <input
    v-model="value"
    class="outline-none transition-all"
    :class="[sizeClass]"
    :type="type ? type : 'text'"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const value = defineModel<string>();

// Create a util
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "py-1 px-2 text-sm";
    case "md":
      return "py-2 px-4 text-base";
    case "lg":
      return "py-3 px-5 text-lg";
    default:
      return "py-2 px-4 text-base";
  }
});

interface InputProps {
  type?: "text" | "file";
  size?: "sm" | "md" | "lg";
}

const props = defineProps<InputProps>();
</script>
