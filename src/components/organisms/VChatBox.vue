<template>
	<div class="flex items-end gap-2 p-5">
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
			<div v-if="imageForm.image" class="flex bg-white dark:bg-slate-700 rounded-md m-1 inline-flex items-center py-1 px-1 mb-1">
				<img class="p-1 w-8 h-8 object-cover" :src="imageForm.image" alt="Attached image" />
				<p>{{ imageForm.title }}</p>
				<VIconButton
          @click="remove"
          class="pl-2"
          icon="./src/assets/images/close.svg"
          size="sm"
          :invert="true"
        />
			</div>
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

interface ImageForm {
	image: string
	title: string
}

const isInputTextFocus = ref<boolean>(false)
const fileInput = ref<HTMLInputElement | null>(null)
const message = ref<string>("")
const imageForm = ref<ImageForm>({
	image: "",
	title: ""
})

const curColorTheme = computed(() => {
	return props.channel.color ? props.channel.color : "bg-slate-800"
})

const remove = () => {
	message.value = ""
	imageForm.value.image = ""
	fileInput.value.value = ""
}

const sendMessage = () => {
	emits("send", message.value ? message.value : "Sent an image", imageForm.value.image)
	message.value = ""
	imageForm.value.image = ""
}

const openFileSelector = () => {
	if(fileInput.value){
		fileInput.value.click()
	}
}

const attachFile = (e: Event) => {
	const file = fileInput.value.files[0]
	const reader = new FileReader()
	const isImage = /\.(jpe?g|png|gif)$/.test(file.name)

	if(isImage) {
		reader.onload = () => {
			imageForm.value.image = reader.result
			imageForm.value.title = file.name
		}
		reader.readAsDataURL(file)
	}
}


const emits = defineEmits<{
	send: [message: string, image: string]
}>()

const props = defineProps<{
	channel: Channel
}>()

</script>