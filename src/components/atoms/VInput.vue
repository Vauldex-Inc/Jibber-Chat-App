<template>
  <input
    v-model="value"
    class="outline-none transition-all"
    :class="inputSizeClass(size)"
    :type="type ? type : 'text'"
  />
</template>

<script setup lang="ts">
import { inputSizeClass } from "@/composables/useSize";

const value = defineModel<string>();

interface InputProps {
  type?: "text" | "file" | "password";
  size?: "sm" | "md" | "lg";
}

defineProps<InputProps>();
</script>
