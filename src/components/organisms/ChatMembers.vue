<template>
  <div class="members">
    <header class="p-5 flex items-center justify-between">
      <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
        {{ header.title }}
      </p>
      <VButton
        size="small"
        @click="onOpen"
        class="rounded-md font-semibold capitalize hover:bg-indigo-100 dark:hover:bg-slate-900"
      >
        <p
          :class="channel.color"
          class="inline-block bg-clip-text text-transparent"
        >
          {{ header.action }}
        </p>
      </VButton>          
    </header>
    
    <div class="flex items-center gap-3 p-3">
      <img
        src="@/assets/images/profile.svg"
        class="aspect-square h-8 dark:invert"
      />
      <p>
        {{ getChannelUsersCount(channel.id) }}
      </p>
    </div>

    <VModal @close="open = false" :is-open="open">
      <DisplayMembers :id-channel="channel.id" />
    </VModal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import { storeToRefs } from "pinia"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VButton from "@/components/atoms/VButton.vue"
  import VModal from "../atoms/VModal.vue"
  import DisplayMembers from "./DisplayMembers.vue"

  const { channel } = storeToRefs(useChannelStore())
  const { getChannelUsersCount } = useChannelStore()
  const header = {
    title: "Members",
    action: "View All"
  }
  const open = ref<boolean>(false)

  const onOpen = () => {
    open.value = true
  }
</script>