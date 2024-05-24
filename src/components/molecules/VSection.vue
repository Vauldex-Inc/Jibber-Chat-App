<template>
	<div>
		<div class="flex items-center justify-between mb-2">
			<p class="capitalize font-semibold text-gray-700 dark:text-gray-300">{{title}}</p>
			<VButton 
				size="sm"
				@click="emits('click')" 
				class="capitalize text-indigo-600 dark:text-indigo-500 font-semibold hover:bg-indigo-100 dark:hover:bg-slate-900 rounded-md" 
				v-if="actionButton">
				{{ actionButton }}
			</VButton>
		</div>
		<slot/>
	</div>
</template>

<script lang="ts" setup>
import VButton from "@/components/atoms/VButton.vue"

interface VSectionProps {
	title: string;
	actionButton?: string;
}

defineProps<VSectionProps>()

const emits = defineEmits<{
	click: [];
}>()
</script>