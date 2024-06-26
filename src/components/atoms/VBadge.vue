<template>
  <span
    :class="color ? color : 'bg-indigo-600'"
    class="rounded-full px-2 py-1 text-xs font-semibold text-gray-100 dark:text-gray-200"
  >
    {{ count }}
  </span>
</template>

<script lang="ts" setup>
import { z, ZodError } from "zod"

const PropSchema = z.object({
  color: z.string().optional(),
  count: z.number(),
})

interface Prop {
  color?: string
  count: number
}

const prop = defineProps<Prop>()

defineOptions({
  inheritAttrs: false,
})

try {
  PropSchema.parse({
    color: prop.color,
    count: prop.count,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
