<template>
	<div class="bg-white shadow-md p-5 rounded-md items-center w-[420px] dark:bg-slate-900">
		<header>
			<h4 class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Select Theme</h4>
			<hr class="my-3 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"/>
		</header>
		<ul class="flex flex-wrap gap-5 p-2">
			<li 
					v-for="color in colorOptions" 
					:key="color" 
					:class="color"
					class="w-14 transition-all aspect-square border-4 border-transparent rounded-full hover:border-gray-700 cursor-pointer dark:hover:border-white"  
					@click="$emit('selectColor', color)"></li>
		</ul>
	</div>
</template>

<script setup lang="ts">
const colorOptions = [
	"bg-red-600",
	"bg-orange-600",
	"bg-amber-600",
	"bg-yellow-600",
	"bg-lime-600",
	"bg-green-600",
	"bg-emerald-600",
	"bg-teal-600",
	"bg-cyan-600",
	"bg-sky-600",
	"bg-blue-600",
	"bg-indigo-600",
	"bg-violet-600",
	"bg-purple-600",
	"bg-fuchsia-600"
	]

const emit = defineEmits<{
	selectColor: []
}>()

</script>