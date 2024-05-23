<template>
	<div>
		<p class="font-semibold w-[70%] truncate text-gray-700 dark:text-gray-400">{{title}}</p>
		<div class="flex items-center justify-between">
			<p
				:class="isBold? 'font-semibold text-gray-800 dark:text-gray-300' : 'font-normal text-gray-500'" 
				class="w-[70%] truncate mt-1">
				{{text}}
			</p>
			<p v-if="subText" >{{subText}}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>

interface VTextGroupProps {
	title: string;
	text: string;
	subText?: string;
	isBold?: boolean
}

defineProps<VTextGroupProps>()
</script>