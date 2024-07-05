<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 p-3">
      <p class="text-2xl font-bold capitalize text-gray-700 dark:text-gray-300">
        Channels
      </p>
      <VIconButton
        class="bg-slate-700 dark:bg-slate-800"
        icon="./src/assets/images/add.svg"
        size="small"
        @click="open = true"
      >
      </VIconButton>
    </div>
    <ul v-if="channels.length !== 0" class="overflow-y-scroll bg-white pb-5 dark:bg-slate-950">
     <li 
      v-for="channel in channels.value"
      :key="channel.id"
      @click="channelStore.set(channel)"
      class="flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-indigo-400/10"
      >
      <div
        class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
        :class="channel.color"
      >
        <p>{{ publicChannelStore.getTitle(channel.id).slice(0, 1) }}</p>
      </div>
      <VTextGroup
        :is-bold="unreadMessageStore.getUnreadMessages(channel.id).length > 0"
        class="flex-1"
        :title="publicChannelStore.getTitle(channel.id)"
        :text="latestMessage(channel.id) ? latestMessage(channel.id)!.text : ''"
      />
      <div v-if="!channel.archivedAt" class="flex flex-col items-center gap-2">
      <p class="text-sm">{{ latestMessage(channel.id) ? formatSentAt(latestMessage(channel.id)!.sentAt) : "" }}</p>
      <VBadge
        v-if="unreadMessageStore.getUnreadMessages(channel.id).length > 0"
        :count="unreadMessageStore.getUnreadMessages(channel.id).length"
        :color="channel.color"
      />
      </div>
      <p
        v-else
        class="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-500 dark:border-red-500/20"
      >
        Archived
      </p>
     </li>
    </ul>
    <p v-else class="h-full pb-5 pt-10 text-center">No channels found.</p>
  </div>
  <VModal @close="open = false" :is-open="open" >
    <AddChannel @close="open = false"/>
  </VModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { formatSentAt } from "@/composables/useDateFormatter"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useMessageStore } from "@/stores/useMessageStore"
import { useChannelStore } from "@/stores/useChannelStore"
import VIconButton from "@/components/molecules/VIconButton.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VModal from "@/components/atoms/VModal.vue"
import AddChannel from "@/components/organisms/AddChannel.vue"
import { storeToRefs } from "pinia";

const publicChannelStore = usePublicChannelStore()
const { channels } = storeToRefs(publicChannelStore)
const channelStore = useChannelStore()
const unreadMessageStore = useUnreadMessageStore()
const messageStore = useMessageStore()

const open = ref<boolean>(false)

const latestMessage = (id: string) => {
  const unreadMessages = unreadMessageStore.getUnreadMessages(id)
  if (unreadMessages.length > 0) {
    return unreadMessages[unreadMessages.length - 1]
  }
  const messages = messageStore.getLatestMessages(id)
  if (messages.length > 0) {
    return messages[messages.length - 1]
  }
}
</script>