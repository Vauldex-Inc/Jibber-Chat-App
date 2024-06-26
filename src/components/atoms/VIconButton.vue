<template>
  <button
    @click="emits('click')"
    :class="[roundedClass, hasPadding ? 'p-0' : sizeClass(size)]"
    class="group transition-all"
    type="button"
  >
    <div class="relative">
      <VImage 
        :source="icon"
        type="icon"
        :invert="invert"
      />
      <p
        class="absolute -bottom-4 left-1/2 z-50 hidden min-w-24 -translate-x-1/2 
        translate-y-full rounded-md bg-slate-800 px-2 py-1 text-sm capitalize text-gray-200 
        group-hover:block"
        v-if="toolTip"
      >
        {{ toolTip }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { sizeClass, customImageSizeClass } from "@/composables/useSize"

import { type Size }  from "@/types/Component"
import VImage from "@/components/atoms/VImage.vue"

const props = defineProps<IconButtonProps>()

interface IconButtonProps {
  size?: Size
  icon: string
  invert?: boolean
  rounded?: boolean
  hasPadding?: boolean
  toolTip?: string
}

const emits = defineEmits<{
  click: []
}>()

const roundedClass = computed(() => {
  return props.rounded ? "rounded-full" : "rounded-md"
})
</script>
