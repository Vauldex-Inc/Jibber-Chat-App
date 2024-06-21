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
            size="sm"
            :invert="true"
          />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import VIconButton from "./VIconButton.vue";

const emits = defineEmits<{ close: [] }>();

defineProps<{
  isOpen: boolean;
  closeButton?: boolean;
}>();

defineOptions({
  inheritAttrs: false,
});
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
