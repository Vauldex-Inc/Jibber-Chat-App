<template>
  <button
    @click="emits('click')"
    :class="[sizeClass, roundedClass]"
    class="transition-all"
    type="button"
  >
    <img :src="icon" alt="icon" :class="imageClass" class="aspect-square invert dark:invert-0" />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "p-1";
    case "md":
      return "p-2";
    case "lg":
      return "p-3";
    default:
      return "p-2";
  }
});

const imageClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-4";
    case "md":
      return "h-6";
    case "lg":
      return "h-10";
    default:
      return "h-6";
  }
});

const roundedClass = computed(() => {
  return props.rounded ? "rounded-full" : "rounded-md";
});

interface IconButtonProps {
  size?: "sm" | "md" | "lg";
  icon: string;
  rounded?: boolean;
}

const props = defineProps<IconButtonProps>();

const emits = defineEmits<{
  click: [];
}>();
</script>
