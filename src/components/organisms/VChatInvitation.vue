<template>
	<div class="flex flex-col justify-between gap-4 w-96 h-54 rounded-md bg-white text-black p-5">
		<header>
			<h4 class="inline font-bold text-gray-600">Notification</h4>
		</header>
		<hr class="border-0 border-b border-b-indigo-300"/>
		<div class="flex items-center gap-4 p-5">
			<span class="p-4 bg-indigo-600 rounded-full flex items-center justify-center">
	      <svg fill="#fff" class="h-8 aspect-square" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
	        <path clip-rule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fill-rule="evenodd"></path>
	      </svg>
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

