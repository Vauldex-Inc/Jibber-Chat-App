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
  import { type BadgeProp } from "@/types/Prop"

  const prop = defineProps<BadgeProp>()

  defineOptions({
    inheritAttrs: false,
  })

  const PropSchema = z.object({
    color: z.string().optional(),
    count: z.number()
  })

  try {
    PropSchema.parse(prop)
  } catch (e) {
    const error = e as ZodError
    console.error(error.message)
  }
</script>
