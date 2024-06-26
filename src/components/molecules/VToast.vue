<template>
  <li
    class="relative w-[380px] -translate-x-3 translate-y-3 overflow-hidden rounded-md border border-indigo-200 bg-indigo-100 p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900"
  >
    <span
      class="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 transition-all"
      :style="'width:' + loadingPercentage + '%'"
    ></span>
    <div class="flex items-center justify-start gap-4">
      <span
        class="rounded-full bg-blue-50 p-1 text-red-500 dark:text-slate-700"
      >
        <img
          src="@/assets/images/check-svgrepo-com.svg"
          alt="success"
          class="h-5 w-5"
        />
      </span>
      <div class="flex flex-1 items-center justify-between">
        <div>
          <p
            class="w-[260px] truncate text-xs font-semibold capitalize text-indigo-950 dark:text-gray-200"
          >
            {{ title }}:
          </p>
          <p
            class="my-2 line-clamp-2 w-[260px] break-words text-indigo-950 dark:text-gray-200"
          >
            {{ message }}
          </p>
        </div>
        <VIconButton
          @click="emits('close', toastId)"
          :invert="true"
          class="ml-4 flex-1 rounded-full p-1"
          icon="./src/assets/images/close.svg"
          size="small"
        />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { z, ZodError } from "zod"
import VIconButton from "@/components/atoms/VIconButton.vue"

interface Prop {
  toastId: string
  message: string
  title: string
}

const prop = defineProps<Prop>()

const emits = defineEmits<{
  close: [value: string]
}>()

const PropSchema = z.object({
  toastId: z.string(),
  message: z.string(),
  title: z.string(),
})

const loadingPercentage = ref<number>(0)
const timerId = ref<number | undefined>(undefined)

onMounted(() => {
  setLoading()
})

onUnmounted(() => {
  clearInterval(timerId.value)
})

const setLoading = () => {
  loadingPercentage.value = 0

  timerId.value = setInterval(() => {
    loadingPercentage.value += (0.74 / 380) * 100
  }, 10)

  setTimeout(() => {
    clearInterval(timerId.value)
    emits("close", prop.toastId)
  }, 5_000)
}

try {
  PropSchema.parse({
    toastId: prop.toastId,
    message: prop.message,
    title: prop.title,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
