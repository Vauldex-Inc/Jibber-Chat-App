<template>
	<div class="relative inline-block">
		<img 
			:src="image? image : './src/assets/images/default-avatar.svg'"
			:class="[imageClass]"
			class="aspect-square relative z-0">
		<div 
			:class="[statusClass]"
			class="absolute bottom-0 right-0 h-5 aspect-square z-10 rounded-full border-[3px] border-gray-100 dark:border-slate-900 translate-x-1 translate-y-1">
		</div>
	</div>
</template>


<script lang="ts" setup>
import {computed} from "vue"

const imageClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-10";
    case "md":
      return "h-12";
    case "lg":
      return "h-16";
    default:
      return "h-12";
  }
});

const statusClass = computed(() => {
  switch (props.status) {
	case "online":
		return "bg-emerald-500";
	case "offline":
		return "bg-slate-400 dark:bg-slate-600";
    default:
      return "bg-slate-400 dark:bg-slate-600";
  }
})

interface VAvatarProps {
	image?: string;
	size?: "sm" | "md" | "lg";
	status?: "online" | "offline"
}

const props = defineProps<VAvatarProps>()
</script>