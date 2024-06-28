<template>
  <div
    @click="openChannel"
    class="flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-indigo-400/10"
  >
    <template v-if="channelType === 'MPU'">
      <div
        class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
        :class="color"
      >
        <p>{{ channelAbbr }}</p>
      </div>
      <VTextGroup
        :is-bold="unReadMessages.length > 0"
        class="flex-1"
        :title="validation.data?.title!"
        :text="latestMessage ? latestMessage.text : ''"
      />
    </template>
    <template v-else>
      <VAvatar
        :image="userStore.senderProfile(item.idUser)"
        :status="userStore.senderStatus(item.idUser)"
      />
      <VTextGroup
        :is-bold="unReadMessages.length > 0"
        class="flex-1"
        :title="userStore.getUserNameById(item.idUser) ?? 'Anonymous'"
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
      class="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-500 dark:border-red-500/20"
    >
      Archived
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"

import { useMessageStore } from "@/stores/useMessageStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useUserStore } from "@/stores/useUserStore"

import VAvatar from "@/components/molecules/VAvatar.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"

import {
  ChannelSchema,
  DirectChannelSchema,
  type Channel,
  type DirectChannel,
} from "@/types/Channel"
import { formatSentAt } from "@/composables/useDateFormatter"

const prop = defineProps<{ item: Channel | DirectChannel }>()

const emits = defineEmits<{
  open: [value: string, type: "SNG" | "MPU"]
}>()

const userStore = useUserStore()
const messageStore = useMessageStore()
const channelUserStore = useChannelUserStore()
const unreadMessageStore = useUnreadMessageStore()
const validation = ChannelSchema.safeParse(prop.item)

const unReadMessages = computed(() => {
  return unreadMessageStore
    .getUnreadMessages()
    .value.filter((ur) => ur.idChannel === prop.item.id)
})

const color = computed(() => {
  return prop.item.color
    ? prop.item.color.trim()
    : "bg-gray-500 dark:bg-slate-800"
})

const channelAbbr = computed(() => {
  if (validation.success) {
    return validation.data.title.slice(0, 1)
  }
})

const latestMessage = computed(() => {
  if (unReadMessages.value.length > 0) {
    return unReadMessages.value[unReadMessages.value.length - 1]
  }

  const messages = messageStore.getLatestMessages().value.filter((m) => {
    if (m) {
      return m.idChannel === prop.item.id
    }
  })

  if (messages.length > 0) {
    return messages[messages.length - 1]
  }
})

const sentAt = computed(() => {
  return latestMessage.value ? formatSentAt(latestMessage.value.sentAt) : ""
})

const openChannel = () => {
  if (validation.success) {
    unreadMessageStore.removeUnreadMessages(prop.item.id)
    emits("open", prop.item.id, "MPU")
  } else {
    unreadMessageStore.removeUnreadMessages(prop.item.id)
    emits("open", prop.item.id, "SNG")
  }
}

const channelType = computed(() => {
  if (validation.success) {
    return "MPU"
  } else {
    return "SNG"
  }
})

onMounted(async () => {
  await channelUserStore.getChannelUsers(prop.item.id)
})
</script>
