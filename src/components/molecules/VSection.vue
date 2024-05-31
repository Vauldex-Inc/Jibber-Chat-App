<template>
	<div>
		<div class="flex items-center justify-between mb-2">
			<p class="capitalize font-semibold text-gray-700 dark:text-gray-300">{{title}}</p>
			<VButton 
				size="sm"
				@click="emits('click')"
				class="capitalize font-semibold hover:bg-indigo-100 dark:hover:bg-slate-900 rounded-md" 
				v-if="actionButton">
				<p :class="curColorTheme" class="text-transparent inline-block bg-clip-text">{{ actionButton }}</p>
			</VButton>
		</div>
		<slot/>
	</div>
</template>

<script lang="ts" setup>
import VButton from "@/components/atoms/VButton.vue"
import {computed} from "vue"

interface VSectionProps {
	title: string;
	actionButton?: string;
	color?: string
}

const curColorTheme = computed(() => {
	return props.color ? props.color : "bg-slate-600 dark:bg-slate-300"
})

const props = defineProps<VSectionProps>()

const emits = defineEmits<{
	click: [];
}>()
</script>