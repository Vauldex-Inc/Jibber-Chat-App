<template>
	<div class="bg-blue-50 h-screen flex justify-center items-center gap-28 text-center">
		<section class="w-1/3 flex flex-col justify-center items-center">
			<div class="w-40">
				<p class="text-2xl font-bold text-start">Welcome to</p>
				<h1 class="text-6xl font-bold text-end text-indigo-600">Jibber</h1>
			</div>
			<div>
				<img class="w-96 h-96" src="@/assets/images/login-welcome.svg" />
			</div>
		</section>
		<section class="bg-white w-1/3 p-8 rounded-lg">
			<form @submit.prevent="login" class="flex flex-col gap-2">
				<h2 class="font-bold text-3xl mb-4">Login</h2>
				<p v-if="error" class="w-full border-2 border-red-600 text-red-500 bg-red-50 p-2 rounded-md">{{ error }}</p>
				<label for="username" class="text-start text-sm font-bold">Username</label>
				<VInput 
						v-model="formData.username"      
						type="text" 
						id="username" 
						required 
						:class="{'border-red-400 focus:border-red-600' : error}"
						class="bg-gray-50 px-5 py-3 rounded-md border-2 outline-none 
										border-gray-300 focus:border-indigo-400 hover:border-indigo-400" />
				<label for="password" class="text-start text-sm font-bold">Password</label>
				<VInput 
						v-model="formData.password" 
						type="password" 
						id="password" 
						required 
						:class="{'border-red-400 focus:border-red-600': error}"
						class="bg-gray-50 px-5 py-3 rounded-md border-2 outline-none 
										border-gray-300 focus:border-indigo-400 hover:border-indigo-400"/>
				<VButton type="submit" class="bg-indigo-600 text-md py-3 px-5 text-white rounded-md mt-4 font-semibold">Login</VButton>
			</form>
			<p class="mt-1.5">Don't have an account? <RouterLink class="text-indigo-600 cursor-pointer" to="/register">Register now</RouterLink></p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, computed } from "vue"
import { useRouter, RouterLink } from "vue-router"
import { useFetch } from '@/composables/useFetch.ts'
import { useUser } from "@/composables/useUser.ts"
import VButton from "@/components/atoms/VButton.vue"
import VInput from "@/components/atoms/VInput.vue"

const error = ref<string>("")
const user = useUser()
const router = useRouter()

if(user) {
	router.push("/")
}

const formData = ref({
	username: "",
	password: ""
})

let id;
const displayError = () => {
	error.value = "User not found!"
	if(id) clearInterval(id)
	id = setTimeout(() => {
		error.value = ""
	}, 5000)
	return id
}

const login = async () => {

	try {
		const response = await useFetch("/sessions", {
			method: "POST",
			body: JSON.stringify(formData.value)
		})

		if(response.status === 200) {
			const result = await response.json()

			localStorage.setItem("user", JSON.stringify(result.user))
			formData.value.username = ""
			formData.value.password = ""
			router.push("/")
		} else if (response.status === 404) {
			displayError()
		}
		return;
	} catch(error) {
		throw new Error(error)
	}

}

</script>
