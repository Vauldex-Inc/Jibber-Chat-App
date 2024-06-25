<template>
  <div
    @click="openChannel"
    class="flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-indigo-400/10"
  >
    <template v-if="item.channelType === 'SNG'">
      <VAvatar 
        :image="userStore.senderProfile(senderId)" 
        :status="userStore.senderStatus(senderId)" 
      />
      <VTextGroup
        :is-bold="unReadMessages.length > 0"
        class="flex-1"
        :title="userStore.senderName(senderId)"
        :text="latestMessage ? latestMessage.text : ''"
      />
    </template>
    <template v-else>
      <div
        class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
        :class="color"
      >
        <p>{{ channelAbbr }}</p>
      </div>
      <VTextGroup
        :is-bold="unReadMessages.length > 0"
        class="flex-1"
        :title="item.title"
        :text="latestMessage ? latestMessage.text : ''"
      />
    </template>
    <div v-if="!item.archivedAt" class="flex flex-col items-center gap-2">
      <p class="text-sm">{{ sentAt }}</p>
      <VBadge
        v-if="unReadMessages.length > 0"
        :count="unReadMessages.length"
        :color="color"
      />
    </div>
    <p
      v-else
      class="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 
      text-xs text-red-500 dark:border-red-500/20"
    >
      Archived
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"

import { useUser } from "@/composables/useUser"
import { useMessageStore } from "@/stores/useMessageStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useUserStore } from "@/stores/useUserStore"

import VAvatar from "@/components/atoms/VAvatar.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"

import type { Channel } from "@/types/Channel"
import { MessageSchema, UnreadMessageSchema } from "@/types/Message"
import { formatSentAt } from "@/utils/formatSentAt"

const prop = defineProps<{ item: Channel }>()

const emits = defineEmits<{
  open: [value: string]
}>()

const loggedUser = useUser()
const userStore = useUserStore()
const messageStore = useMessageStore()
const channelUserStore = useChannelUserStore()
const unreadMessageStore = useUnreadMessageStore()

const senderId = ref<string>('')

const unReadMessages = computed(() => {
  return unreadMessageStore
    .getUnreadMessages()
    .value.filter((ur) => ur.channelId === prop.item.id)
})

const color = computed(() => {
  return prop.item.color
    ? prop.item.color.trim()
    : "bg-gray-500 dark:bg-slate-800"
})

const channelAbbr = computed(() => {
  return prop.item.title.slice(0, 1)
})

const latestMessage = computed(() => {
  if (unReadMessages.value.length > 0) {
    const result = UnreadMessageSchema.safeParse(
      unReadMessages.value[unReadMessages.value.length - 1]
    )
    return result.success ? result.data : console.error(new Error("Unknown Format"))
  }

  const messages = messageStore.getLatestMessages().value.filter((m) => {
    if (m) {
      return m.channelId === prop.item.id
    }
  })

  if (messages.length > 0) {
    const result = MessageSchema.safeParse(messages[messages.length - 1])
    return result.success ? result.data : console.error(new Error("Unknown format"))
  }
})

const sentAt = computed(() => {
  return latestMessage.value ? formatSentAt(latestMessage.value.sentAt) : ""
})

const openChannel = () => {
  unreadMessageStore.removeUnreadMessages(prop.item.id)
  emits("open", prop.item.id)
}



onMounted(async () => {
  await channelUserStore.getChannelUsers(prop.item.id)

  if (prop.item.channelType === "SNG") {
    const users = prop.item.title.split("/")
    const sender = users.find((u) => u !== loggedUser?.id)

    if (sender) {
      senderId.value = sender
    }
  }
})
</script>
