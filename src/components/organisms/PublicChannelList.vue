<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 p-3">
      <p class="text-2xl font-bold text-gray-700 dark:text-gray-300">
        Channels
      </p>
      <VIconButton
        class="bg-slate-700 dark:bg-slate-800"
        icon="./src/assets/images/add.svg"
        size="small"
        @click="publicStore.openChannel()"
      >
      </VIconButton>
    </div>
    <ul class="overflow-y-scroll bg-white pb-5 dark:bg-slate-950">
      <template v-if="items.length !== 0">
        <li v-for="channel in publicStore.channels" :key="channel.id">
          <div
            class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
            :class="color"
          >
            <p>{{ publicStore.getInitials(channel.title) }}</p>
          </div>
          <VTextGroup
            :is-bold="unreadMessageStore.getUnreadMessages(channel.id).length > 0"
            class="flex-1"
            :title="publicStore.getTitle(channel.id)"
            :text="latestMessage ? latestMessage.text : ''"
          />
        </li>
      </template>
      
      <template v-if="channelType === 'MPU'">
        
      </template>
      <template v-if="items.length !== 0">
        <VChatListItem
          @open="openChannel"
          v-for="item in items"
          :key="item.id"
          :item="item"
        />
      </template>
      <template v-else>
        <li class="h-full pb-5 pt-10 text-center">
          No channels found.
        </li>
      </template>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useMessageStore } from "@/stores/useUnreadMessageStore"

const publicStore = usePublicChannelStore()
const unreadMessageStore = useUnreadMessageStore()
const messageStore = useMessageStore()

const latestMessage = computed(() => {
  if (unReadMessages.value.length > 0) {
    return unReadMessages.value[unReadMessages.value.length - 1]
  }

  const messages = messageStore.getLatestMessages().value.filter(
    (m) => m.idChannel === prop.item.id
  )

  if (messages.length > 0) {
    return messages[messages.length - 1]
  }
})
</script>