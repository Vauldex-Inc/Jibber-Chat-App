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
		<section class="bg-white w-1/3 p-8 rounded-lg shadow-md">
			<form @submit.prevent="login" class="flex flex-col gap-2">
				<h2 class="font-bold text-3xl mb-4">Login</h2>
				<p v-if="error" class="w-full border-2 border-red-500 text-red-500 bg-red-50 p-2 rounded-md text-sm">{{ error }}</p>
				<label for="username" class="text-start text-sm font-bold">Username</label>
				<VInput 
						v-model="formData.username"      
						type="text" 
						:value="formData.username"
						id="username" 
						:class="{'border-red-400 focus:border-red-600' : errorUsername}"
						class="bg-gray-50 px-5 py-3 rounded-md border-2 outline-none 
										border-gray-300 focus:border-indigo-400 hover:border-indigo-400" />
				<label for="password" class="text-start text-sm font-bold">Password</label>
				<div class="relative">
					<VInput 
							v-model="formData.password" 
							:type="passwordType"
							:value="formData.password"
							ref="passwordInputField"
							id="password" 
							:class="{'border-red-400 focus:border-red-600': errorPassword }"
							class="w-full inline bg-gray-50 px-5 pr-12 py-3 rounded-md border-2 outline-none 
											border-gray-300 focus:border-indigo-400 hover:border-indigo-400"/>
					<VIconButton size="sm" :icon="icon" @click="toggle" class="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2  bg-indigo-600" />
				</div>
				<VButton type="submit" class="bg-indigo-600 text-md py-3 px-5 text-white rounded-md mt-4 font-semibold" v-if="!isLoading">Login</VButton>
				<VButton type="submit" class="bg-indigo-600 text-md py-3 px-5 text-white rounded-md mt-4 font-semibold flex justify-center" v-else>
          <div class="w-4 h-4 p-2 mr-3 border-indigo-700/50 border-b-indigo-200 border-2 rounded-full animate-spin">
            <p class="sr-only">Loading</p>
          </div>
            Processing...
        </VButton>
			</form>
			<p class="mt-1.5">Don't have an account? <RouterLink class="text-indigo-600 cursor-pointer" to="/register">Register now</RouterLink></p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter, RouterLink } from "vue-router"
import { useFetch } from '@/composables/useFetch.ts'
import VButton from "@/components/atoms/VButton.vue"
import VInput from "@/components/atoms/VInput.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"

const error = ref<string>("")
const errorUsername = ref<boolean>(false)
const errorPassword = ref<boolean>(false)
const router = useRouter()
const isLoading = ref<boolean>(false)
const passwordType = ref<"text" | "password">("password")
const icon = ref<string>('./src/assets/images/visibility-true.svg')

const formData = ref({
	username: "",
	password: ""
})

const toggle = () => {
	if(passwordType.value === "text") {
		passwordType.value = "password"
		icon.value = './src/assets/images/visibility-true.svg'
	} else {
		passwordType.value = "text"
		icon.value = "./src/assets/images/visibility-false.svg"
	}
}

const timerId = ref<number | undefined>(undefined)
const displayError = (textError: string) => {
	error.value = textError
	if(timerId.value) {
		clearInterval(timerId.value)
	}

	timerId.value = setTimeout(() => {
		error.value = ""
		errorUsername.value = false
		errorPassword.value = false
	}, 5000)
}

const resetFields = (refData: Ref, ...fieldName: string[]) => {
	for(const [key, value] of Object.entries(refData.value)) {
		if(fieldName.includes(key)) refData.value[key] = ""
	}
}

const highlightErrorFields = (...fields: Ref[]) => {
	errorUsername.value = false
	errorPassword.value = false	
	fields.forEach((field) => {
		field.value = true
	})
}


const checkInputFields = () => {
	if(formData.value.username.trim() === "" && formData.value.password.trim() === "") {
		displayError("Fill up required fields.")
		highlightErrorFields(errorUsername, errorPassword)
		resetFields(formData, "username", "password")
		return false;
	} else if (formData.value.username.trim() === "") {
		displayError("Username is required.")
		highlightErrorFields(errorUsername)
		resetFields(formData, "username")
		return false;
	} else if (formData.value.password.trim() === "") {
		displayError("Password is required.")
		highlightErrorFields(errorPassword)
		resetFields(formData, "password")
		return false;
	} else {
		return true
	}
}

const login = async () => {
	if(checkInputFields() === false) return

	isLoading.value = true
	try {
		const response = await useFetch("/sessions", {
			method: "POST",
			body: JSON.stringify(formData.value)
		})

		if(response.status === 200) {
			const result = await response.json()

			localStorage.setItem("user", JSON.stringify(result.user))
			resetFields(formData, "username", "password")
			router.push("/dashboard")
		} else if (response.status === 404) {
			highlightErrorFields()
			displayError("Incorrect username and password combination")
		}
	} catch(error) {
		throw new Error(error)
	} finally {
		isLoading.value = false
	}

}

</script>
