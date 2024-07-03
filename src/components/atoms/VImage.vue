<template>
  <img
    :src="getImage"
    :class="[imageType(type), customImageSizeClass(prop.size)]"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { customImageSizeClass } from "@/composables/useSize"

const prop = defineProps<{
  source?: string
  type: string
  size?: string
  invert?: boolean
}>()

const getImage = computed(
  () => prop.source || "./src/assets/images/default-avatar.svg",
)

const imageType = (ratio: string) => {
  switch (ratio) {
    case "icon":
      return [
        "aspect-square rounded-full object-cover",
        prop.invert ? "invert dark:invert-0" : "invert-0",
      ]

    case "avatar":
      return "relative z-0 aspect-square rounded-full object-cover w-12"

    case "message":
      return "mt-2 aspect-auto max-h-48 rounded-md"

    case "info":
      return "h-24 w-32 rounded-md border-2 border-slate-200 object-cover dark:border-slate-800"

    case "preview":
      return "h-8 w-8 object-cover p-1"

    default:
      return "object-cover aspect-square p-1"
  }
}
</script>
