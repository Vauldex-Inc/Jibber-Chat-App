<template>
	<span :class="color? color : 'bg-indigo-600'" class="py-1 px-2 rounded-full text-xs text-gray-100 dark:text-gray-200 font-semibold">
		{{count}}
	</span>
</template>

<script lang="ts" setup>

interface VBadgeProps {
	color?: string;
	count: number;
}

defineOptions({
	inheritAttrs: false
})

defineProps<VBadgeProps>()
</script>