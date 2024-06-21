<template>
  <button
    @click="emits('click')"
    :class="[roundedClass, hasPadding ? 'p-0' : sizeClass(size)]"
    class="group transition-all"
    type="button"
  >
    <div class="relative">
      <img
        :src="icon"
        alt="icon"
        :class="[
          customImageSizeClass(size),
          invert ? 'invert dark:invert-0' : 'invert-0',
        ]"
        class="aspect-square rounded-full object-cover"
      />
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
import { computed } from "vue";
import { sizeClass, customImageSizeClass } from "@/composables/useSize";

const roundedClass = computed(() => {
  return props.rounded ? "rounded-full" : "rounded-md";
});

interface IconButtonProps {
  size?: "sm" | "md" | "lg" | "xl";
  icon: string;
  invert?: boolean;
  rounded?: boolean;
  hasPadding?: boolean;
  toolTip?: string;
}

const props = defineProps<IconButtonProps>();

const emits = defineEmits<{
  click: [];
}>();
</script>
