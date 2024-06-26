<template>
  <button
    @click="emits('click')"
    :class="sizeClass(size)"
    class="capitalize transition-all"
    :type="action ? action : 'button'"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { z, ZodError } from "zod"
import { sizeClass } from "@/composables/useSize"

interface Prop {
  size?: "small" | "medium" | "large"
  action?: "submit" | "button"
}

const prop = defineProps<Prop>()

const emits = defineEmits<{
  click: []
}>()

const PropSchema = z.object({
  size: z.enum(["small", "medium", "large"]).optional(),
  action: z.enum(["submit", "button"]).optional(),
})

try {
  PropSchema.parse({
    size: prop.size,
    action: prop.action,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
