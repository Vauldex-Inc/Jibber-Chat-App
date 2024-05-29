<template>
  <div v-if="isOpen"
    class="p-4 bg-indigo-200 dark:bg-slate-900 rounded-md relative overflow-hidden m-4 max-w-[380px] z-40"
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
        <p class="text-indigo-900 dark:text-gray-200">Notification: {{ message }}</p>
        <VIconButton
            @click="close"
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
import { ref, onMounted } from "vue"
import VIconButton from "@/components/atoms/VIconButton.vue"

const loadingPercentage = ref<number>(0)
const isOpen = ref<boolean>(true)
const timerId = ref<number | undefined>(undefined);

const setLoading = () => {
  loadingPercentage.value = 0

  timerId.value = setInterval(() => {
    loadingPercentage.value += 1.1
  }, 50)

  setTimeout(() => {
    clearInterval(timerId.value)
    close()
  }, 5000)
}

const close = (e) => {
  isOpen.value = false
}

defineProps<{
  message: string
}>()

onMounted(() => {
  setLoading()
})  
</script>