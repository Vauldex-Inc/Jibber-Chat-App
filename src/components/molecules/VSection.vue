<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
        {{ title }}
      </p>
      <VButton
        size="small"
        @click="emits('click')"
        class="rounded-md font-semibold capitalize hover:bg-indigo-100 dark:hover:bg-slate-900"
        v-if="actionButton"
      >
        <p
          :class="curColorTheme"
          class="inline-block bg-clip-text text-transparent"
        >
          {{ actionButton }}
        </p>
      </VButton>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { z, ZodError } from "zod"
import VButton from "@/components/atoms/VButton.vue"

interface Prop {
  title: string
  actionButton?: string
  color?: string
}

const prop = defineProps<Prop>()

const emits = defineEmits<{
  click: []
}>()

const PropSchema = z.object({
  title: z.string(),
  actionButton: z.string().optional(),
  color: z.string().optional(),
})

try {
  PropSchema.parse({
    title: prop.title,
    actionButton: prop.actionButton,
    color: prop.color,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}

const curColorTheme = computed(() => {
  return prop.color ? prop.color : "bg-slate-600 dark:bg-slate-300"
})
</script>
