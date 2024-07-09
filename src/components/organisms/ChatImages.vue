<template>
  <div class="images">
    <header class="p-5 pb-0 flex items-center justify-between">
      <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
        {{ header.title }}
      </p>
      <VButton
        size="small"
        @click="open = true"
        class="rounded-md font-semibold capitalize hover:bg-indigo-100 dark:hover:bg-slate-900"
      >
        <p
          :class="[channel.color ? channel.color : 'text-gray-700 dark:text-gray-300']"
          class="inline-block bg-clip-text text-transparent"
          v-if="chatImages.length > 0"
        >
          {{ header.action }}
        </p>
      </VButton>          
    </header>

    <div class="p-3 pb-5">
      <ul
        class="flex flex-wrap items-start justify-center gap-1 overflow-y-scroll"
        v-if="chatImages.length > 0"
      >
        <template v-for="image in displayImages">
          <li v-if="image">
            <img
              class="h-24 w-32 rounded-md border-2 border-slate-200 object-cover dark:border-slate-800"
              :src="image"
            />
          </li>
        </template>
      </ul>
      <p v-else class="text-center">No images found</p>
    </div>
    <VModal :is-open="open" @close="open = false">
      <ViewImage :chatImages="allImages" />
    </VModal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { storeToRefs } from "pinia"
  import { useMessageStore } from "@/stores/useMessageStore"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VButton from "@/components/atoms/VButton.vue"
  import VModal from "@/components/atoms/VModal.vue"
  import ViewImage from "@/components/organisms/ViewImage.vue"
  const { chatImages } = storeToRefs(useMessageStore())
  const { channel } = storeToRefs(useChannelStore())
  const open = ref<boolean>(false)
  const header = {
    title: "Images",
    action: "View All"
  }
  const displayImages = computed(() => {
    return chatImages.value.reverse().slice(0, 4)
  })

  const allImages = computed(() => {
    return chatImages.value.filter((img) => img !== "")
  })
</script>