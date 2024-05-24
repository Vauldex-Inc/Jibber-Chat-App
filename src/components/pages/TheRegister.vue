<template>
	<main class="bg-blue-50 h-screen flex justify-center items-center gap-20">
		<section class="w-2/5">
			<div class="pb-8">
				<p class="font-bold text-4xl text-black">LET'S GET YOU STARTED!</p>
				<p>It's quick and easy</p>
			</div>
			<form @submit.prevent class="bg-white w-[500px] max-w-full p-8 rounded-lg flex flex-col justify-center gap-3 shadow-md">
				<p class="text-center text-black text-3xl">Register</p>
				<p v-if="error" class="text-red-500 text-center text-sm border border-red-600 bg-red-500/10 p-3 rounded-md">{{ error }}</p>
				<label for="username" class="font-semibold">Username</label>
				<input id="username" type="text" class="bg-gray-50 px-5 py-3 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" v-model="username" required />
				<label for="password" class="font-semibold">Password</label>
				<input id="password" type="password" class="bg-gray-50 px-5 py-3 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" v-model="password" required />
				<label for="confirm" class="font-semibold">Confirm Password</label>
				<input id="confirm" type="password" class="bg-gray-50 px-5 py-3 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" v-model="confirmation" required />
				<button type="submit" class="bg-indigo-600 text-md px-5 py-3 text-white rounded-md mt-4" @click="register">Register</button>
				<p class="text-center">Already have an account? <RouterLink class="text-indigo-600 focus:border-indigo-600 hover:underline cursor-pointer" to="/login">Login Here</RouterLink></p>
			</form>
		</section>
		<section>
			<p class="font-bold text-center text-7xl text-black">JIBBER</p>
			<img class="mt-10" src="@/assets/images/register-illustration.svg" />
		</section>
	</main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { useFetch } from '@/composables/useFetch.ts'

interface Account {
	username: string
	password: string
}

const username = ref<string>('')
const password = ref<string>('')
const confirmation = ref<string>('')
const error = ref<string>('')
const account = computed(() => {
	return { 
		username: username.value,
		password: password.value
 	}
})

const validate = () => {
	if(password.value === confirmation.value && password.value !== "" && confirmation.value !== "") {
		error.value = ""
	} else {
		error.value = "Password does not match."
	}
}

const register = async () => {
	try {
		validate()
		if(!error.value) {
				let option = {
				method: "POST",
				body: JSON.stringify(account.value)
			}
			const response = await useFetch("/users", option)
		}
	} catch(e) {
		error.value = "Oops! Something went wrong. Try again."
	} finally {
		resetInputs()
	}
}

const resetInputs = () => {
	username.value = ""
	password.value = ""
	confirmation.value = ""
	setTimeout(() => {
			error.value = ""
		}, 2000)
}

</script>