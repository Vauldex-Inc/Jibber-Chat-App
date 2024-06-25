<template>
  <div class="relative inline-block">
    <img
      :src="getImage"
      :class="imageSizeClass(size)"
      class="relative z-0 aspect-square rounded-full object-cover"
    />
    <div
      :class="statusClass"
      class="absolute bottom-0 right-0 z-10 aspect-square h-5 translate-x-1 translate-y-1 rounded-full border-[3px] border-gray-100 dark:border-slate-900"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ZodError, z } from "zod"
import { imageSizeClass } from "@/composables/useSize"

const PropSchema = z.object({
  image: z.string().optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  status: z.enum(["online", "offline"]).optional(),
})

interface Prop {
  image?: string
  size?: string
  status?: string
}

const prop = defineProps<Prop>()
const statusClass = computed(() => {
  switch (prop.status) {
    case "online":
      return "bg-emerald-500"
    case "offline":
      return "bg-slate-400 dark:bg-slate-600"
    default:
      return "bg-slate-400 dark:bg-slate-600"
  }
})

const getImage = computed(
  () => prop.image || "./src/assets/images/default-avatar.svg",
)

try {
  PropSchema.parse({
    image: prop.image,
    size: prop.size,
    status: prop.status,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
