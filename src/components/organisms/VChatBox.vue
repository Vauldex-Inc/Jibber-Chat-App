<template>
	<div class="flex items-center gap-2 p-5">
		<input 
				@change="attachFile"
				hidden
				class="hidden" 
				type="file" 
				ref="fileInput">
		<VIconButton
			@click="openFileSelector"
			size="lg" 
			class="bg-indigo-600"
			icon="./src/assets/images/file.svg"/>
		<VInput 
				v-model="message"
				placeholder="Aa"
				class="flex-1 rounded-md border-2 border-indigo-300 focus:border-indigo-600 hover:border-indigo-600
						dark:bg-slate-900 dark:border-slate-800 dark:focus:border-indigo-600 dark:hover:border-indigo-600"
				size="lg"/>
		<VIconButton
			size="lg" 
			class="bg-indigo-600"
			icon="./src/assets/images/send.svg"/>
	</div>
</template>

<script setup lang="ts">
import VInput from "@/components/atoms/VInput.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import {ref,onMounted} from "vue"


const fileInput = ref<HTMLInputElement | null>(null)

const message = ref<string>("")


const openFileSelector = () => {
	if(fileInput.value){
		fileInput.value.click()
	}
}

const attachFile = (e: Event) => {
	console.log(e.target.files)
}


</script>