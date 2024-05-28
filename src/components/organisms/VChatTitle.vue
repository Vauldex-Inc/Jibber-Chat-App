<template>
	<div class="flex items-center justify-start gap-5 p-5 border-b border-b-indigo-200
			 dark:border-b-slate-800 dark:shadow-none">
		<VAvatar size="md" />
		<div>
			<div>
				<p class="text-gray-700 dark:text-gray-300 font-semibold">{{name}}</p>
				<p>{{count}} members</p>
			</div>
		</div>
		<VIconButton 
				class="bg-indigo-600 ml-auto"
				icon="./src/assets/images/archive.svg"/>
	</div>
</template>

<script lang="ts" setup>
import VAvatar from "@/components/atoms/VAvatar.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"


defineProps<{
	name: string
	count: number;
}>()
</script>