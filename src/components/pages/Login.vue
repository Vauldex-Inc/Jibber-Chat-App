<template>
  <div
    class="flex h-screen items-center justify-center gap-28 bg-blue-50 text-center"
  >
    <section class="flex w-1/3 flex-col items-center justify-center">
      <div class="w-40">
        <p class="text-start text-2xl font-bold">Welcome to</p>
        <h1 class="text-end text-6xl font-bold text-indigo-600">Jibber</h1>
      </div>
      <div>
        <img class="h-96 w-96" src="@/assets/images/login-welcome.svg" />
      </div>
    </section>
    <section class="w-1/3 rounded-lg bg-white p-8 shadow-md">
      <form @submit.prevent="login" class="flex flex-col gap-2">
        <h2 class="mb-4 text-3xl font-bold">Login</h2>
        <p
          v-if="error"
          class="w-full rounded-md border-2 border-red-500 bg-red-50 p-2 text-sm text-red-500"
        >
          {{ error }}
        </p>
        <label for="username" class="text-start text-sm font-bold"
          >Username</label
        >
        <VInput
          v-model="formData.username"
          type="text"
          :value="formData.username"
          id="username"
          :class="{ 'border-red-400 focus:border-red-600': errorUsername }"
          class="rounded-md border-2 border-gray-300 bg-gray-50 px-5 py-3 outline-none hover:border-indigo-400 focus:border-indigo-400"
        />
        <label for="password" class="text-start text-sm font-bold"
          >Password</label
        >
        <div class="relative">
          <VInput
            v-model="formData.password"
            :type="passwordType"
            :value="formData.password"
            ref="passwordInputField"
            id="password"
            :class="{ 'border-red-400 focus:border-red-600': errorPassword }"
            class="inline w-full rounded-md border-2 border-gray-300 bg-gray-50 px-5 py-3 pr-12 outline-none hover:border-indigo-400 focus:border-indigo-400"
          />
          <VIconButton
            size="xsmall"
            :icon="icon"
            @click="toggle"
            class="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 p-1"
          />
        </div>
        <VButton
          type="submit"
          class="text-md mt-4 rounded-md bg-indigo-600 px-5 py-3 font-semibold text-white"
          v-if="!isLoading"
          >Login</VButton
        >
        <VButton
          type="submit"
          class="text-md mt-4 flex justify-center rounded-md bg-indigo-600 px-5 py-3 font-semibold text-white"
          v-else
        >
          <div
            class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-indigo-700/50 border-b-indigo-200 p-2"
          >
            <p class="sr-only">Loading</p>
          </div>
          Processing...
        </VButton>
      </form>
      <p class="mt-1.5">
        Don't have an account?
        <RouterLink class="cursor-pointer text-indigo-600" to="/register"
          >Register now</RouterLink
        >
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref, type Ref } from "vue"
  import { useRouter, RouterLink } from "vue-router"
  import { useAuthStore } from "@/stores/useAuthStore"
  import VButton from "@/components/atoms/VButton.vue"
  import VInput from "@/components/atoms/VInput.vue"
  import VIconButton from "@/components/molecules/VIconButton.vue"

  const session = useAuthStore()

  const timerId = ref<number | undefined>(undefined)
  const error = ref<string>("")
  const errorUsername = ref<boolean>(false)
  const errorPassword = ref<boolean>(false)
  const router = useRouter()
  const isLoading = ref<boolean>(false)
  const passwordType = ref<"text" | "password">("password")
  const icon = ref<string>("./src/assets/images/visibility-true.svg")
  const formData = ref({
    username: "",
    password: "",
  })

  const toggle = () => {
    if (passwordType.value === "text") {
      passwordType.value = "password"
      icon.value = "./src/assets/images/visibility-true.svg"
    } else {
      passwordType.value = "text"
      icon.value = "./src/assets/images/visibility-false.svg"
    }
  }

  const displayError = (textError: string) => {
    error.value = textError
    if (timerId.value) {
      clearInterval(timerId.value)
    }

    timerId.value = setTimeout(() => {
      error.value = ""
      errorUsername.value = false
      errorPassword.value = false
    }, 5000)
  }

  const resetFields = (refData: Ref, ...fieldName: string[]) => {
    for (const [key, value] of Object.entries(refData.value)) {
      if (fieldName.includes(key)) refData.value[key] = ""
    }
  }

  const highlightErrorFields = (...fields: Ref<boolean>[]) => {
    errorUsername.value = false
    errorPassword.value = false
    fields.forEach((field) => {
      field.value = true
    })
  }

  const checkInputFields = () => {
    if (
      formData.value.username.trim() === "" &&
      formData.value.password.trim() === ""
    ) {
      displayError("Fill up required fields.")
      highlightErrorFields(errorUsername, errorPassword)
      resetFields(formData, "username", "password")
      return false
    } else if (formData.value.username.trim() === "") {
      displayError("Username is required.")
      highlightErrorFields(errorUsername)
      resetFields(formData, "username")
      return false
    } else if (formData.value.password.trim() === "") {
      displayError("Password is required.")
      highlightErrorFields(errorPassword)
      resetFields(formData, "password")
      return false
    } else {
      return true
    }
  }

  const login = async () => {
    if (checkInputFields() === false) return

    isLoading.value = true
    try {
      const response = await session.post(formData.value)
      if (response) {
        resetFields(formData, "username", "password")
        router.push("/dashboard")
      } else {
        throw Error("Incorrect username and password combination")
      }
    } catch (e) {
      const error = e as Error
      
      highlightErrorFields()
      displayError(error.message)
    } finally {
      isLoading.value = false
    }
  }
</script>
