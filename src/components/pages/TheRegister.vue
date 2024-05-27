<template>
  <main class="bg-blue-50 h-screen flex justify-center items-center gap-20">
    <section class="w-2/5">
      <div class="pb-8">
        <p class="font-bold text-4xl text-black">LET'S GET YOU STARTED!</p>
        <p>It's quick and easy</p>
      </div>
      <form @submit.prevent class="bg-white w-[500px] max-w-full p-8 rounded-lg flex flex-col justify-center gap-3 shadow-md">
        <p class="text-center text-3xl font-medium">Register</p>
        <p v-if="error" class="text-red-500 text-center text-sm border border-red-600 bg-red-500/10 p-3 rounded-md">{{ error }}</p>
        <label for="username" class="font-semibold">Username</label>
        <VInput
          type="text"
          size="lg"
          v-model="formData.username"
          id="username" 
          class="bg-gray-50 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600"
          required
        />
        <label for="password" class="font-semibold">Password</label>
        <div class="relative">
          <VInput
            :type="type"
            size="lg"
            v-model="formData.password"
            id="password" 
            class="bg-gray-50 rounded-md w-full border-2 pr-12 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600"
            required
          />
          <VIconButton
            size="sm"
            :icon="icon"
            class="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 bg-indigo-600"
            @click="toggle"
          />
        </div>
        <label for="confirm" class="font-semibold">Confirm Password</label>
        <div class="relative">
          <VInput
            :type="type"
            size="lg"
            v-model="formData.confirmation"
            id="confirm" 
            class="bg-gray-50 rounded-md border-2 w-full pr-12 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600"
            required
          />
          <VIconButton
            size="sm"
            :icon="icon"
            class="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 bg-indigo-600"
            @click="toggle"
          />
        </div>
        <VButton
          v-if="!loader" 
          action="submit" 
          size="md"
          class="bg-indigo-600 text-md text-white rounded-md mt-4" 
          @click="register">
          Register
        </VButton>
        <VButton
          v-else 
          action="button" 
          class="bg-indigo-600 text-md text-white rounded-md mt-4 flex justify-center"
          disabled>
          <div class="p-2 mr-3 border-indigo-700/50 border-b-indigo-200 border-4 rounded-full animate-spin">
            <p class="sr-only">Loading</p>
          </div>
            Processing...
        </VButton>
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
import { RouterLink, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { useFetch } from '@/composables/useFetch.ts'
import VInput from '@/components/atoms/VInput.vue'
import VButton from '@/components/atoms/VButton.vue'
import VIconButton from '@/components/atoms/VIconButton.vue'


const formData = ref({
  username: "",
  password: "",
  confirmation: ""
})
const error = ref<string>('')
const loader = ref<boolean>(false)
const visibility = ref<boolean>(false)
const icon = ref<string>('./src/assets/images/visibility-true.svg')
const type = ref<string>('password')
const router = useRouter()

const register = async () => {
  try {
    validate()
    if(!error.value) {
      loader.value = true
      const response = await useFetch("/users", {
        method: "POST",
        body: JSON.stringify(formData.value)
      })

      if(response.status === 201) {
        setTimeout(() => {
          router.push("/login")
        }, 1000)
      } else {
        loader.value = false
        error.value = "Oops! Something went wrong. Try again."
      }
    }
  } catch(e) {
    throw new Error(e)
  } finally {
    resetInputs()
  }
}

const validate = () => {
  if(formData.value.password !== formData.value.confirmation && 
     formData.value.password !== "" && 
     formData.value.confirmation !== "") {
    error.value = "Password does not match."
  } else if(formData.value.username === "" ||
            formData.value.password === "" ||
            formData.value.confirmation === "") {
    error.value = "Input fields are empty."
  } else {
    error.value = ""
  }
}

const toggle = () => {
  if(type.value === "text") {
    type.value = "password"
    icon.value = "./src/assets/images/visibility-true.svg"
  } else {
    type.value = "text"
    icon.value = "./src/assets/images/visibility-false.svg"
  }
}

const resetInputs = () => {
  formData.value.username = ""
  formData.value.password = ""
  formData.value.confirmation = ""
  setTimeout(() => {
      error.value = ""
    }, 5000)
}

</script>