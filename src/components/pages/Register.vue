<template>
  <main class="flex h-screen items-center justify-center gap-20 bg-blue-50">
    <section class="w-2/5">
      <div class="pb-8">
        <p class="text-4xl font-bold text-black">LET'S GET YOU STARTED!</p>
        <p>It's quick and easy</p>
      </div>
      <form
        name="registerForm"
        method="POST"
        @submit.prevent="onSubmit"
        class="flex w-[500px] max-w-full flex-col justify-center gap-3 rounded-lg bg-white p-8 shadow-md"
      >
        <p class="text-center text-3xl font-medium">Register</p>
        <VFormError :error="message"/>
        <ul
          v-if="current === 'username' && requirements.length !== 0"
          class="rounded-md border bg-gray-100 p-3 text-xs text-red-500"
        >
          <li v-for="validation in requirements">
            <p :class="{ 'text-green-500': requirements }">
              • {{ validation }}
            </p>
          </li>
        </ul>
        <ul
          v-if="current === 'password' && requirements.length !== 0"
          class="rounded-md border bg-gray-100 p-3 text-xs text-red-500"
        >
          <li v-for="validation in requirements">
            <p :class="{ 'text-green-500': requirements }">
              • {{ validation }}
            </p>
          </li>
        </ul>
        <label for="username" class="font-semibold">Username</label>
        <VInput
          id="username"
          v-model="form.username"
          type="text"
          size="large"
          maxlength="20"
          class="rounded-md border-2 border-gray-300 bg-gray-50 outline-none hover:border-indigo-600 focus:border-indigo-600"
          @focus="onFocus('username')"
          @update:model-value="onInput(UsernameSchema, form.username)"
        />
        <label for="password" class="font-semibold">Password</label>
        <div class="relative">
          <VInput
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            size="large"
            class="w-full rounded-md border-2 border-gray-300 bg-gray-50 pr-12 outline-none hover:border-indigo-600 focus:border-indigo-600"
            @focus="onFocus('password')"
            @update:model-value="onInput(PasswordSchema, form.password)"
          />
          <VIconButton
            size="xsmall"
            :icon="showPasswordIcon"
            tabindex="20"
            class="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 p-1"
            @click="showPassword = !showPassword"
          />
        </div>
        <label for="confirm" class="font-semibold">Confirm Password</label>
        <div class="relative">
          <VInput
            id="confirm"
            :type="showPassword ? 'text' : 'password'"
            size="large"
            v-model="form.confirmation"
            class="w-full rounded-md border-2 border-gray-300 bg-gray-50 pr-12 outline-none hover:border-indigo-600 focus:border-indigo-600"
            @focus="onFocus(undefined)"
          />
          <VIconButton
            size="xsmall"
            :icon="showPasswordIcon"
            tabindex="21"
            class="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 p-1"
            @click="showPassword = !showPassword"
          />
        </div>
        <VButton
          v-if="!loader"
          action="submit"
          size="medium"
          class="text-md mt-4 rounded-md bg-indigo-600 text-white"
        >
          Register
        </VButton>
        
        <div v-else class="text-md mt-4 flex justify-center rounded-md bg-indigo-600 px-5 py-3 font-semibold text-white">
          <div class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-indigo-700/50 border-b-indigo-200 p-2">
            <p class="sr-only">Loading</p>
          </div>
          Processing...
        </div>
        <p class="text-center">
          Already have an account?
          <RouterLink
            class="cursor-pointer text-indigo-600 hover:underline focus:border-indigo-600"
            to="/login"
            >Login Here
          </RouterLink>
        </p>
      </form>
    </section>
    <section>
      <p class="text-center text-7xl font-bold text-black">JIBBER</p>
      <img class="mt-10" src="@/assets/images/register-illustration.svg" />
    </section>
  </main>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from "vue"
  import { useRouter, RouterLink } from "vue-router"
  import { z, ZodError, ZodSchema } from "zod"
  import { useUserStore } from "@/stores/useUserStore"
  import VInput from "@/components/atoms/VInput.vue"
  import VButton from "@/components/atoms/VButton.vue"
  import VIconButton from "@/components/molecules/VIconButton.vue"
  import VFormError from "@/components/atoms/VFormError.vue"

  const UsernameSchema = z
    .string({ required_error: "Username is required" })
    .min(8, { message: "Must be at least 8 characters long" })
    .regex(/^[^@]+$/, { message: "Must not have @ character" })

  const PasswordSchema = z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Must be at least 8 characters long"})
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/, { 
      message: "Must contain at least one uppercase, one digit, and one special character." 
    })
  
  const RegisterSchema = z.object({
    username: UsernameSchema,
    password: PasswordSchema,
    confirmation: PasswordSchema
  }).superRefine((form, ctx) => {
    if (form.password !== form.confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password does not match"
      })
    }
  })

  const userStore = useUserStore()
  const message = ref<string | undefined>()
  const loader = ref(false)
  const requirements = ref<string[]>([])
  const showPassword = ref(false)
  const current = ref<"username" | "password" | undefined>()
  const form = ref({
    username: "",
    password: "",
    confirmation: ""
  })

  const showPasswordIcon = computed(() => showPassword.value 
    ? './src/assets/images/visibility-true.svg' 
    : './src/assets/images/visibility-false.svg'
  )

  const onInput = <T extends ZodSchema>(schema: T, value: string) => {
    try {
      schema.parse(value)
      requirements.value = []
    } catch (e) {
      const error = e as ZodError
      requirements.value = error.errors.map((e) => e.message)
    }
  }

  const onFocus = (type: "username" | "password" | undefined) => {
    current.value = type
    requirements.value = []
  }

  const onSubmit = async () => {
    loader.value = true
    try {
      RegisterSchema.parse(form.value)
      await userStore.post(form.value)
      useRouter().push("/dashboard")
    } catch (e) {
      const error = e as ZodError | Error
      loader.value = false
      if (error instanceof ZodError) {
        message.value = error.errors.find((e) => e.code === "custom")?.message
      } else if (error instanceof Error) {
        message.value = error.message
      }
    }
  }

  watch(message, () => {
    setTimeout(() => {
      message.value = ""
    }, 3000)
  })
</script>
