<template>
  <button
    @click="emits('click')"
    :class="sizeClass(size)"
    class="capitalize transition-all"
    :type="action ? action : 'button'"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { sizeClass } from "@/composables/useSize";

interface ButtonProps {
  size?: "sm" | "md" | "lg";
  action?: "submit" | "button";
}

defineProps<ButtonProps>();

const emits = defineEmits<{
  click: [];
}>();
</script>
