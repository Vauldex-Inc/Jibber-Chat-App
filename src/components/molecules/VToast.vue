<template>
  <li
    class="p-3 shadow-lg -translate-x-3 translate-y-3 border border-indigo-200 dark:border-slate-800 bg-indigo-100 dark:bg-slate-900 rounded-md overflow-hidden w-[380px] relative"
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
          <p class="text-indigo-950 dark:text-gray-200 text-xs font-semibold w-[260px] truncate capitalize">{{title }}:</p>
          <p class="text-indigo-950 dark:text-gray-200 my-2 line-clamp-2 w-[260px] break-words">{{ message }}</p>
        </div>
        <VIconButton
            @click="emits('close',toastId)"
            :invert="true"
            class="rounded-full ml-4 p-1 flex-1"
            icon="./src/assets/images/close.svg"
            size="sm"
          />
      </div>
    </div>
  </li>  
</template>

<script setup lang="ts">
import { ref, onMounted ,onUnmounted } from "vue"
import VIconButton from "@/components/atoms/VIconButton.vue"

const loadingPercentage = ref<number>(0)
const timerId = ref<number | undefined>(undefined);

const setLoading = () => {
  loadingPercentage.value = 0

  timerId.value = setInterval(() => {
    loadingPercentage.value += (0.74/380) * 100
  }, 10)

  setTimeout(() => {
    clearInterval(timerId.value)
    emits('close', props.toastId)
  }, 5_000)
}

const props = defineProps<{
  toastId: string
  message: string
  title: string
}>()

const emits = defineEmits<{
  close: [value: string]
}>()

onMounted(() => {
  setLoading()
})  
onUnmounted(() => {
  clearInterval(timerId.value)
})
</script>
