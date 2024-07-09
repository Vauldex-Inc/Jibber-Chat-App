<template>
  <div class="members">
    <header class="p-5 pb-0 flex items-center justify-between">
      <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
        {{ header.title }}
      </p>
      <VButton
        size="small"
        @click="onOpen"
        class="rounded-md font-semibold capitalize hover:bg-indigo-100 dark:hover:bg-slate-900"
      >
        <p
          :class="color"
          class="inline-block bg-clip-text text-transparent"
        >
          {{ header.action }}
        </p>
      </VButton>          
    </header>
    
    <div class="flex items-center gap-3 p-3 pb-5 px-5">
      <img
        src="@/assets/images/profile.svg"
        class="aspect-square h-8 dark:invert"
      />
      <p>
        {{ channelStore.getChannelUsersCount(channel.id) }}
      </p>
    </div>

    <VModal @close="open = false" :is-open="open">
      <DisplayMembers :id-channel="channel.id" />
    </VModal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { storeToRefs } from "pinia"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VButton from "@/components/atoms/VButton.vue"
  import VModal from "../atoms/VModal.vue"
  import DisplayMembers from "./DisplayMembers.vue"

  const channelStore = useChannelStore()
  const header = {
    title: "Members",
    action: "View All"
  }
  const { channel } = storeToRefs(useChannelStore())

  const open = ref<boolean>(false)

  const color = computed(() => {
    return channel.value.color ? channel.value.color : 'dark:bg-gray-300 bg-gray-700'
  })

  const onOpen = () => {
    open.value = true
  }
</script>