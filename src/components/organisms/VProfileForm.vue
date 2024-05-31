<template>
	<form @submit.prevent="create" class="bg-white w-96 dark:bg-slate-900 max-w-full p-5 rounded-lg flex flex-col justify-center gap-3 shadow-md" >
		<div class="relative flex justify-center">
			<VAvatar
				:image="formData.image"
				size="lg"
				status="online"
			/>
			<input 
				@change="attachFile"
				hidden
				class="hidden" 
				type="file" 
				ref="fileInput"/>
			<VIconButton
				@click="openFileSelector"
				size="sm"
				icon="./src/assets/images/edit.svg"
				rounded
				class="absolute dark:bg-slate-800 dark:focus:border-indigo-600 focus:border-indigo-600 dark:bg-slate-700 bottom-0 right-32 translate-y-0.5 -translate-x-2 z-20 bg-indigo-600"
			/>
		</div>
		<label for="nickname">Nickname</label>
		<VInput
			id="nickname"
			size="lg"
			v-model="formData.nickName"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
			v-focus
		/>
		<label for="firstname">Firstname</label>
		<VInput
			id="firstname"
			size="lg"
			v-model="formData.firstName"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
		/>
		<label for="lastname">Lastname</label>
		<VInput
			id="lastname"
			size="lg"
			v-model="formData.lastName"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
		/>
		<label for="email">Email</label>
		<VInput
			id="email"
			size="lg"
			v-model="formData.email"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
		/>
		<VButton
			action="submit"
			size="lg"
			class="bg-indigo-600 text-md text-white rounded-md mt-4" 
		>
		Add
		</VButton>
	</form>
</template>

<script setup lang="ts">
import VAvatar from '@/components/atoms/VAvatar.vue'
import VIconButton from '@/components/atoms/VIconButton.vue'
import VInput from '@/components/atoms/VInput.vue'
import VButton from '@/components/atoms/VButton.vue'
import type { ProfileData } from '@/types/Profile.ts'
import { ref, watchEffect } from 'vue'

const emits = defineEmits<{
	submit: [value: Profile | undefined]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const formData = ref<ProfileData>({
	nickName: "",
	firstName: "",
	lastName: "",
	image: "",
	email: ""
})

const openFileSelector = () => {
	if(fileInput.value) {
		fileInput.value.click()
	}
}

const attachFile = () => {
	const file = fileInput.value.files[0]
	const reader = new FileReader()
	const isImage = /\.(jpe?g|png|gif)$/.test(file.name)

	if(isImage) {
		reader.onload = () => {
		  formData.value.image = reader.result
		}
	  reader.readAsDataURL(file)
	}
}

const create = () => {
	emits('submit', undefined)
}

const vFocus = {
	mounted: (el) => el.focus()
}

</script>