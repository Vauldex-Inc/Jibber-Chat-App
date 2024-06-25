<template>
  <span
    :class="color ? color : 'bg-indigo-600'"
    class="rounded-full px-2 py-1 text-xs font-semibold text-gray-100 dark:text-gray-200"
  >
    {{ count }}
  </span>
</template>

<script lang="ts" setup>
interface VBadgeProps {
  color?: string
  count: number
}

defineProps<VBadgeProps>()

defineOptions({
  inheritAttrs: false,
})
</script>
