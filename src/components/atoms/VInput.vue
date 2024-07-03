<template>
  <input
    v-model="value"
    class="outline-none transition-all"
    :class="inputSizeClass(size)"
    :type="type ? type : 'text'"
  />
</template>

<script setup lang="ts">
import { z, ZodError } from "zod"
import { inputSizeClass } from "@/composables/useSize"
import type { InputProp } from "@/types/Prop"

const prop = defineProps<InputProp>()
const value = defineModel<string>()

const PropSchema = z.object({
  type: z.enum(["text", "file", "password"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
})

try {
  PropSchema.parse(prop)
} catch (e) {
  const error = e as ZodError
  console.error(error.message)
}
</script>
