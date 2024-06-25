<template>
  <input
    v-model="value"
    class="outline-none transition-all"
    :class="inputSizeClass(size)"
    :type="type ? type : 'text'"
  />
</template>

<script setup lang="ts">
import { inputSizeClass } from "@/composables/useSize"

interface InputProps {
  type?: "text" | "file" | "password"
  size?: "small" | "medium" | "large"
}

defineProps<InputProps>()

const value = defineModel<string>()
</script>
