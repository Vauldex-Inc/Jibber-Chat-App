<template>
	<div class="flex items-center gap-2 p-5">
		<input 
				@change="attachFile"
				hidden
				class="hidden" 
				type="file" 
				ref="fileInput">
		<VIconButton
		  :disabled="channel.archivedAt !== undefined"
			@click="openFileSelector"
			size="lg" 
			:class="[curColorTheme, {'opacity-50' : channel.archivedAt}]"
			icon="./src/assets/images/file.svg"/>
		<div class="p-0.5 rounded-md overflow-hidden flex-1" 
				 :class="[curColorTheme, isInputTextFocus ? 'bg-opacity-100' : 'bg-opacity-30']">
			<VInput 
					:disabled="channel.archivedAt !== undefined"
					@focus="isInputTextFocus = true"
					@blur="isInputTextFocus = false"
					@keyup.enter="sendMessage"
					v-model="message"
					:placeholder="channel.archivedAt ? 'You can\'t reply to this channel' : 'Aa'"
					class="w-full rounded-md bg-gray-100 dark:bg-slate-900 dark:placeholder:text-gray-600"
					size="lg"/>
		</div>
		<VIconButton
		  :disabled="channel.archivedAt !== undefined"
			@click="sendMessage"
			size="lg" 
			:class="[curColorTheme, {'opacity-50' : channel.archivedAt}]"
			icon="./src/assets/images/send.svg"/>
	</div>
</template>

<script setup lang="ts">
import VInput from "@/components/atoms/VInput.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import type {Channel} from "@/types/Channel.ts"
import {ref,onMounted,computed} from "vue"

const isInputTextFocus = ref<boolean>(false)

const fileInput = ref<HTMLInputElement | null>(null)

const message = ref<string>("")

const curColorTheme = computed(() => {
	return props.channel.color ? props.channel.color : "bg-slate-800"
})


const sendMessage = () => {
	emits("send", message.value)
	message.value = ""
}

const openFileSelector = () => {
	if(fileInput.value){
		fileInput.value.click()
	}
}

const attachFile = (e: Event) => {
	// TODO: attache file to message
}


const emits = defineEmits<{
	send: [value: string]
}>()

const props = defineProps<{
	channel: Channel
}>()

</script>