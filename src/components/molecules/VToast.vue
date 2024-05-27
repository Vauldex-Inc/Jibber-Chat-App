<template>
  <div v-if="isOpen"
    class="p-4 bg-indigo-300 dark:bg-slate-700 rounded-md relative overflow-hidden m-4 max-w-[380px] z-40 animate-showIn"
  >
    <span
      class="bg-indigo-500 w-0 h-1 absolute bottom-0 left-0 transition-all"
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
        <p class="text-indigo-600 dark:text-indigo-300">Notification: {{ message }}</p>
        <button
          type="button"
          @click="close"
          class="rounded-full ml-4 p-1 dark:text-gray-400 dark:hover:text-gray-200 text-gray-400 hover:text-gray-500"
        >
          <!-- close icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 24 24"
            class="w-4 h-4"
          >
            <path
              fill="currentColor"
              d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

const loadingPercentage = ref<number>(0)
const message = ref<string>('New Message')

let timerId;
const setLoading = () => {
  loadingPercentage.value = 0

  timerId = setInterval(() => {
    loadingPercentage.value += 1.1
  }, 50)

  setTimeout(() => {
    clearInterval(timerId)
    close()
  }, 5000)
}

onMounted(() => {
  setLoading()
})

const isOpen = ref<boolean>(true)
const close = (e) => {
  isOpen.value = false
}
  
</script>