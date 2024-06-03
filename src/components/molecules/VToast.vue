<template>
  <div
    class="fixed top-5 right-0 -translate-x-5 p-3 shadow-lg border border-indigo-200 bg-indigo-100 dark:bg-slate-900 rounded-md overflow-hidden w-[380px] z-40"
  >
    <span
      class="bg-indigo-600 w-0 h-1 absolute bottom-0 left-0 transition-all"
      :style="'width:' + loadingPercentage + '%'"
    ></span>
    <div class="flex items-center justify-start gap-4">
      <span
        class="p-1 rounded-full bg-blue-50 text-red-500 dark:text-slate-700"
      >
        <img
          src="@/assets/images/check-svgrepo-com.svg"
          alt="success"
          class="h-5 w-5"
        />
      </span>
      <div class="flex items-center justify-between flex-1">
        <div>
          <p class="text-indigo-950 dark:text-gray-200 text-xs font-semibold">{{title }}:</p>
          <p class="text-indigo-950 dark:text-gray-200 my-2 line-clamp-2">{{ message }}</p>
        </div>
        <VIconButton
            @click="emits('close')"
            :invert="true"
            class="rounded-full ml-4 p-1"
            icon="./src/assets/images/close.svg"
            size="sm"
          />
      </div>
    </div>
  </div>  
</template>

<script setup lang="ts">
import { ref, onMounted  } from "vue"
import VIconButton from "@/components/atoms/VIconButton.vue"

const loadingPercentage = ref<number>(0)
const timerId = ref<number | undefined>(undefined);

const setLoading = () => {
  loadingPercentage.value = 0

  timerId.value = setInterval(() => {
    loadingPercentage.value += (0.38/380) * 100
  }, 10)

  setTimeout(() => {
    clearInterval(timerId.value)
    emits('close')
  }, 10_000)
}

defineProps<{
  message: string
  title: string
}>()

const emits = defineEmits<{
  close: []
}>()

onMounted(() => {
  setLoading()
})  
</script>