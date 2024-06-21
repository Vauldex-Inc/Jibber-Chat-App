<template>
  <div class="relative inline-block">
    <img
      :src="image ? image : './src/assets/images/default-avatar.svg'"
      :class="imageSizeClass(size)"
      class="relative z-0 aspect-square rounded-full object-cover"
    />
    <div
      :class="[statusClass]"
      class="absolute bottom-0 right-0 z-10 aspect-square h-5 translate-x-1 translate-y-1 rounded-full border-[3px] border-gray-100 dark:border-slate-900"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { imageSizeClass } from "@/composables/useSize";

const statusClass = computed(() => {
  switch (props.status) {
    case "online":
      return "bg-emerald-500";
    case "offline":
      return "bg-slate-400 dark:bg-slate-600";
    default:
      return "bg-slate-400 dark:bg-slate-600";
  }
});

interface VAvatarProps {
  image?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline";
}

const props = defineProps<VAvatarProps>();
</script>
