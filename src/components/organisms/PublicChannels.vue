<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 p-3 sticky top-0 z-20 dark:bg-slate-950 bg-white">
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
    <ul v-if="transformChannels.length !== 0" class="overflow-y-scroll bg-white dark:bg-slate-950">
     <li 
      v-for="channel in transformChannels"
      :key="channel.id"
      @click="onClickChannel(channel.id)"
      class="flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-indigo-400/10"
      >
      <div
        class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
        :class="channel.color"
      >
        <p>{{ channel.title.slice(0,1) }}</p>
      </div>
      <VTextGroup
        :is-bold="channel.hasUnread"
        class="flex-1"
        :title="channel.title"
        :text="channel.text"
      />
      <div v-if="!channel.archivedAt" class="flex flex-col items-center gap-2">
      <p class="text-sm">{{ channel.sentAt }}</p>
      <VBadge
        v-if="getUnreadMessages(channel.id).length > 0"
        :count="getUnreadMessages(channel.id).length"
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
    <AddChannel @onSuccess="open = false"/>
  </VModal>
</template>

<script lang="ts" setup>
  import { ref, computed } from "vue";
  import { formatSentAt } from "@/composables/useDateFormatter"
  import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
  import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
  import { useMessageStore } from "@/stores/useMessageStore"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VIconButton from "@/components/molecules/VIconButton.vue"
  import VTextGroup from "@/components/molecules/VTextGroup.vue"
  import VBadge from "@/components/atoms/VBadge.vue"
  import VModal from "@/components/molecules/VModal.vue"
  import AddChannel from "@/components/organisms/AddChannel.vue"
  import type { UnreadMessage, Message } from "@/types/Message"

  const { getTitle, channels } = usePublicChannelStore()
  const channel = useChannelStore()
  const { getUnreadMessages, hasUnread } = useUnreadMessageStore()
  const { getLatestMessages } = useMessageStore()

  const open = ref<boolean>(false)

  const transformChannels = computed(() => channels.value.map((r) => {
    const { text, sentAt } = latestMessage(r.id)
    return {
      id: r.id,
      title: getTitle(r.id),
      sentAt: sentAt ? formatSentAt(sentAt) : sentAt,
      text,
      color: r.color || 'bg-gray-600',
      archivedAt: r.archivedAt,
      hasUnread: hasUnread(r.id)
    }
  }))

  const latestMessage = (idChannel: string): { text: string, sentAt: string } => {
    let message = {} as UnreadMessage | Message
    const unReadMessages = getUnreadMessages(idChannel)
    if (getUnreadMessages(idChannel).length > 0) {
      message = unReadMessages[unReadMessages.length - 1]
    }
    const messages = getLatestMessages(idChannel).filter((m) => m.idChannel === idChannel)
    if (messages.length > 0) {
      message = messages[messages.length - 1]
    }
    return {
      text: message.text || "",
      sentAt: message.sentAt
    }
  }

  const onClickChannel = (idChannel: string) => {
    const _channel = channels.value.find((r) => r.id === idChannel)
    if (_channel) {
      channel.set(_channel)
    }
  }
</script>