<template>
	<div class="flex flex-col justify-between gap-4 w-96 h-54 rounded-md bg-white text-black p-5">
		<header>
			<h4 class="inline font-bold text-gray-600">Notification</h4>
		</header>
		<hr class="border-0 border-b border-b-indigo-300"/>
		<div class="flex items-center gap-4 p-5">
			<span class="p-4 bg-indigo-600 rounded-full flex items-center justify-center">
				<img src="@/assets/images/notif.svg" class="h-8 aspect-square"/>
	    </span>
			<p class="text-center">{{description}}</p>
		</div>
		<hr class="border-0 border-b border-b-indigo-300"/>
		<footer class="flex gap-4 self-end">
			<VButton class="border bg-indigo-300 rounded-md text-slate-700" @click="emits('close')">Close</VButton>			
			<VButton class="border bg-indigo-600 rounded-md text-white" @click="emits('view')">Take a Look</VButton>
		</footer>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/atoms/VButton.vue"

const props = defineProps<{
	description: string
}>()

const emits = defineEmits<{
	close: []
	view: []
}>()

</script>

