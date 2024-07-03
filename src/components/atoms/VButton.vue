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
import { type ButtonProp } from "@/types/Prop";
import { SizeSchema } from "@/types/Component";


const prop = defineProps<ButtonProp>()
const emits = defineEmits(["click"])

const PropSchema = z.object({
  size: SizeSchema.optional(),
  action: z.enum(["submit", "button"]).optional()
})

try {
  PropSchema.parse(prop)
} catch (e) {
  const error = e as ZodError
  console.error(error.message)
}
</script>
