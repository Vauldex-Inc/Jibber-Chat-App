<template>
  <button
    @click="emits('click')"
    :class="[roundedClass, hasPadding ? 'p-0' : sizeClass(size)]"
    :size="size"
    class="group transition-all"
    type="button"
  >
    <div class="relative">
      <VImage :size="size" :source="icon" type="icon" :invert="invert" />
      <p
        class="absolute -bottom-4 left-1/2 z-50 hidden min-w-24 -translate-x-1/2 translate-y-full rounded-md bg-slate-800 px-2 py-1 text-sm capitalize text-gray-200 group-hover:block"
        v-if="toolTip"
      >
        {{ toolTip }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { z, ZodError } from "zod"
import { sizeClass } from "@/composables/useSize"

import { type Size } from "@/types/Component"
import VImage from "@/components/atoms/VImage.vue"

interface Prop {
  size?: Size
  icon: string
  type?: string
  invert?: boolean
  rounded?: boolean
  hasPadding?: boolean
  toolTip?: string
}

const prop = defineProps<Prop>()

const emits = defineEmits<{
  click: []
}>()

const PropSchema = z.object({
  size: z
    .enum(["extraSmall", "small", "medium", "large", "extraLarge"])
    .optional(),
  icon: z.string(),
  type: z.string().optional(),
  invert: z.boolean().optional(),
  rounded: z.boolean().optional(),
  hasPadding: z.boolean().optional(),
  toolTip: z.string().optional(),
})

const roundedClass = computed(() => {
  return prop.rounded ? "rounded-full" : "rounded-md"
})

try {
  PropSchema.parse({
    size: prop.size,
    icon: prop.icon,
    invert: prop.invert,
    rounded: prop.rounded,
    hasPadding: prop.hasPadding,
    toolTip: prop.toolTip,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
