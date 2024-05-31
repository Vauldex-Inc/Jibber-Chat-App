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
		<p v-if="error" class="text-red-500 text-center text-sm border border-red-600 bg-red-500/10 p-3 rounded-md">{{ error }}</p>
		<label for="nickname">Nickname</label>
		<VInput
			id="nickname"
			v-model="formData.nickName"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
			v-focus
		/>
		<label for="firstname">Firstname</label>
		<VInput
			id="firstname"
			v-model="formData.firstName"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
		/>
		<label for="lastname">Lastname</label>
		<VInput
			id="lastname"
			v-model="formData.lastName"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
		/>
		<label for="email">Email</label>
		<VInput
			id="email"
			size="md"
			v-model="formData.email"
			class="bg-gray-50 dark:bg-slate-800 dark:border-slate-700 rounded-md border-2 outline-none border-gray-300 dark:focus:border-indigo-600 focus:border-indigo-600 hover:border-indigo-600"
		/>
		<VButton
			v-if="method === 'POST'"
			action="submit"
			class="bg-indigo-600 text-md text-white rounded-md mt-4 py-3 px-5"
		>
		Add
		</VButton>
		<VButton
			v-else
			action="submit"
			class="bg-indigo-600 text-md text-white rounded-md mt-4 py-3 px-5"
		>
		Update
		</VButton>
	</form>
</template>

<script setup lang="ts">
import VAvatar from '@/components/atoms/VAvatar.vue'
import VIconButton from '@/components/atoms/VIconButton.vue'
import VInput from '@/components/atoms/VInput.vue'
import VButton from '@/components/atoms/VButton.vue'

import type { ProfileData, Profile } from '@/types/Profile.ts'
import { ref, watchEffect, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch.ts'
import { useUserStore } from '@/stores/useUserStore.ts'
import { useUser } from '@/composables/useUser.ts'

const emits = defineEmits<{
	submit: []
}>()

const method = ref<"POST" | "PUT" | undefined>()
const error = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const formData = ref<ProfileData>({
	nickName: "",
	firstName: "",
	lastName: "",
	image: "",
	email: ""
})

const currUser = useUser()
const { getUserById, addUserProfile } = useUserStore()

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

const create = async () => {
	try {
		const response = await useFetch("/profiles", {
			method: method.value,
			body: JSON.stringify(formData.value)
		})

		if(response.status === 200) {
			if(currUser) {
				const newProfile: Profile = {
					userId: currUser.id,
					nickName: formData.value.nickName,
					firstName: formData.value.firstName,
					lastName: formData.value.lastName,
					image: formData.value.image,
					email: formData.value.email
				}
				addUserProfile(currUser.id, newProfile)
			}
			emits('submit')
		} else {
			error.value = "Oops, something went wrong."
		}
	} catch(e) {
		throw new Error(e)
	}	finally {
		setTimeout(() => {
			error.value = ""
		}, 2000)
	}
}

const doesExist = () => {
	if(currUser) {
		const [user, profile] = getUserById(currUser.id)

		if(profile) {
			method.value = "PUT"
			formData.value.nickName = profile.nickName
			formData.value.firstName = profile.firstName
			formData.value.lastName = profile.lastName
			formData.value.image = profile.image
			formData.value.email = profile.email
		} else {
			method.value = "POST"
		}
	}
}

const vFocus = {
	mounted: (el) => el.focus()
}

onMounted(() => {
	doesExist()
})

</script>