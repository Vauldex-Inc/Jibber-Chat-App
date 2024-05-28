<template>
  <main class="bg-blue-50 dark:bg-slate-950 text-gray-600 dark:text-gray-400">
    <RouterView />
  </main>
</template>


<!--
  # Import order
    1. Vue
    2  Other dependencies
    3. Components
    4. Types

  # Spacing in import. ex: `import { MethodName } from '...'`
 -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onMounted} from "vue"
import {useTheme} from "@/composables/useTheme"

onMounted(() => {
  const theme = useTheme()
  theme.init()
})
</script>
