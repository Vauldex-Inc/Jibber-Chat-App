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

interface Prop {
  type?: "text" | "file" | "password"
  size?: "small" | "medium" | "large"
}

const prop = defineProps<Prop>()

const value = defineModel<string>()

const PropSchema = z.object({
  type: z.enum(["text", "file", "password"]).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
})

try {
  PropSchema.parse({
    type: prop.type,
    size: prop.size,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
