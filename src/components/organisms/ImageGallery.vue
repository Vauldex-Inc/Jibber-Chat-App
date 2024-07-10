<template>
  <div
    class="relative flex h-screen w-screen items-center justify-center bg-slate-900/70"
  >
    <img class="rounded-md p-1" :src="chatImages[count]" />
    <div class="absolute left-5" v-if="chatImages.length > 1">
      <VIconButton
        tool-tip="previous"
        size="large"
        @click="move('left')"
        icon="./src/assets/images/left-button.svg"
      />
    </div>
    <div class="absolute right-5" v-if="chatImages.length > 1">
      <VIconButton
        tool-tip="next"
        size="large"
        @click="move('right')"
        icon="./src/assets/images/right-button.svg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import VIconButton from "@/components/molecules/VIconButton.vue"

  const props = defineProps<{
    chatImages: string[]
  }>()

  const count = ref<number>(0)

  const move = (dir: string) => {
    const length = props.chatImages.length
    count.value = (count.value + (dir === "left" ? -1 : 1) + length) % length
  }
</script>