<template>
  <p
    v-if="error"
    class="rounded-md border border-red-600 bg-red-500/10 p-3 text-center text-sm text-red-500"
  >
    {{ error }}
  </p>
</template>

<script setup lang="ts">
  defineProps<{ error?: string}>()
</script>