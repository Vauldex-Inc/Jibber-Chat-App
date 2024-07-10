<template>
  <div class="flex h-screen items-center justify-center gap-28 bg-blue-50 text-center">
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
      <form method="POST" name="loginForm" class="flex flex-col gap-2" @submit.prevent="onSubmit" >
        <h2 class="mb-4 text-3xl font-bold">
          Login
        </h2>
        <p
          v-if="message"
          class="w-full rounded-md border-2 border-red-500 bg-red-50 p-2 text-sm text-red-500"
        >
          {{ message }}
        </p>

        <label for="username" class="text-start text-sm font-bold">
          Username
        </label>
        <VInput
          id="username"
          name="username"
          type="text"
          class="rounded-md border-2 border-gray-300 bg-gray-50 px-5 py-3 outline-none hover:border-indigo-400 focus:border-indigo-400"
        />
        <label for="password" class="text-start text-sm font-bold"
          >Password</label
        >
        <div class="relative">
          <VInput
            id="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            class="inline w-full rounded-md border-2 border-gray-300 bg-gray-50 px-5 py-3 pr-12 outline-none hover:border-indigo-400 focus:border-indigo-400"
          />
          <VIconButton
            size="xsmall"
            :icon="showPasswordIcon"
            @click="showPassword = !showPassword"
            class="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 p-1"
          />
        </div>

        <VButton
          v-if="!isLoading"
          type="submit"
          class="text-md mt-4 rounded-md bg-indigo-600 px-5 py-3 font-semibold text-white"
        >
          Login
        </VButton>

        <div v-else class="text-md mt-4 flex justify-center rounded-md bg-indigo-600 px-5 py-3 font-semibold text-white">
          <div class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-indigo-700/50 border-b-indigo-200 p-2">
            <p class="sr-only">Loading</p>
          </div>
          Processing...
        </div>
      </form>
      <p class="mt-1.5">
        Don't have an account?
        <RouterLink class="cursor-pointer text-indigo-600" to="/register">
          Register now
        </RouterLink>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, type Ref, watch } from "vue"
  import { useRouter, RouterLink } from "vue-router"
  import { useAuthStore } from "@/stores/useAuthStore"
  import VButton from "@/components/atoms/VButton.vue"
  import VInput from "@/components/atoms/VInput.vue"
  import VIconButton from "@/components/molecules/VIconButton.vue"

  const session = useAuthStore()
  const router = useRouter()

  const message = ref('')
  const isLoading = ref(false)
  const showPassword = ref(false)

  const showPasswordIcon = computed(() => showPassword.value 
    ? './src/assets/images/visibility-true.svg' 
    : './src/assets/images/visibility-false.svg'
  )

  watch(message, () => {
    setTimeout(() => {
      message.value = ""
    }, 5000)
  })

  const onSubmit = async (event: Event) => {
    const $form = event.target as HTMLFormElement
    isLoading.value = true
    try {
      await session.post({
        username: $form.username.value,
        password: $form.password.value
      })

      router.push("/dashboard")
    } catch {
      isLoading.value = false
      message.value = 'Authentication Failed! Please try again.'
    }
  }
</script>
