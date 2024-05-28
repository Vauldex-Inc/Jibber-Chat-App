<template>
  <main class="bg-blue-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400">
    <RouterView />
  </main>
</template>


<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onMounted} from "vue"
import {useTheme} from "@/composables/useTheme"

onMounted(() => {
  const theme = useTheme()
  theme.init()
})
</script>