<template>
  <div
    :class="statusClass"
    class="absolute bottom-0 right-0 z-10 aspect-square h-5 translate-x-1 
    translate-y-1 rounded-full border-[3px] border-gray-100 dark:border-slate-900"
  >
    <!-- User Status -->
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { type Status, StatusSchema } from '@/types/User'

  const prop = defineProps<{
    status?: Status
  }>()

  const statusClass = computed(() => {
    switch (prop.status) {
      case StatusSchema.enum.online:
        return "bg-emerald-500"
      case StatusSchema.enum.offline:
        return "bg-slate-400 dark:bg-slate-600"
      default:
        return "bg-slate-400 dark:bg-slate-600"
    }
  })
</script>