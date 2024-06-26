<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 text-gray-600 dark:bg-slate-950/70 dark:text-gray-400"
    >
      <Transition name="modal">
        <div class="relative" v-if="isOpen">
          <slot />
          <VIconButton
            v-if="closeButton ? closeButton : true"
            @click="emits('close')"
            class="absolute right-0 top-0 -translate-x-1/2 translate-y-1/2"
            icon="./src/assets/images/close.svg"
            size="small"
            :invert="true"
          />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { z, ZodError } from "zod"
import VIconButton from "./VIconButton.vue"

interface Prop {
  isOpen: boolean
  closeButton?: boolean
}

const prop = defineProps<Prop>()

const emits = defineEmits<{ close: [] }>()

defineOptions({
  inheritAttrs: false,
})

const PropSchema = z.object({
  isOpen: z.boolean(),
  closeButton: z.boolean().optional(),
})

try {
  PropSchema.parse({
    isOpen: prop.isOpen,
    closeButton: prop.closeButton,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.modal-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
</style>
