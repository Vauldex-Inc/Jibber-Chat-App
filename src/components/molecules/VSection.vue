<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
        {{ title }}
      </p>
      <VButton
        size="sm"
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
import VButton from "@/components/atoms/VButton.vue";
import { computed } from "vue";

interface VSectionProps {
  title: string;
  actionButton?: string;
  color?: string;
}

const curColorTheme = computed(() => {
  return props.color ? props.color : "bg-slate-600 dark:bg-slate-300";
});

const props = defineProps<VSectionProps>();

const emits = defineEmits<{
  click: [];
}>();
</script>
