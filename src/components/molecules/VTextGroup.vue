<template>
  <div>
    <p class="w-[70%] truncate font-semibold text-gray-700 dark:text-gray-400">
      {{ title }}
    </p>
    <div class="flex items-center justify-between">
      <p
        :class="
          isBold
            ? 'font-semibold text-gray-800 dark:text-gray-300'
            : 'font-normal text-gray-500'
        "
        class="mt-1 line-clamp-1 w-[80%]"
      >
        {{ text }}
      </p>
      <p v-if="subText">{{ subText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TextGroupProp } from "@/types/Prop"
import { z, ZodError } from "zod"


const prop = defineProps<TextGroupProp>()

const PropSchema = z.object({
  title: z.string().optional(),
  text: z.string(),
  subText: z.string().optional(),
  isBold: z.boolean().optional()
})

try {
  PropSchema.parse(prop)
} catch (e) {
  const error = e as ZodError
  console.error(error.message)
}
</script>
