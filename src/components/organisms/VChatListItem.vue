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
        :title="channelStore.getTitle(item.id)"
        :text="latestMessage ? latestMessage.text : ''"
      />
    </template>
    <template v-else>
      <VAvatar
        :image="profileStore.getImage(item.idUser)"
        :status="userStore.getStatus(item.idUser)"
      />
      <VTextGroup
        :is-bold="unReadMessages.length > 0"
        class="flex-1"
        :title="profileStore.getName(item.idUser)"
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

import {
  ChannelSchema,
  DirectChannelSchema,
  type Channel,
  type DirectChannel,
} from "@/types/Channel"
import { formatSentAt } from "@/composables/useDateFormatter"

import { useMessageStore } from "@/stores/useMessageStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useUserStore } from "@/stores/useUserStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"

import VAvatar from "@/components/molecules/VAvatar.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"

const prop = defineProps<{ item: Channel | DirectChannel }>()

const emits = defineEmits<{
  open: [value: string, type: "SNG" | "MPU"]
}>()

const profileStore = useUserProfileStore()
const userStore = useUserStore()
const messageStore = useMessageStore()
const channelUserStore = useChannelUserStore()
const unreadMessageStore = useUnreadMessageStore()
const channelStore = usePublicChannelStore()

const unReadMessages = computed(() => {
  return unreadMessageStore
    .getUnreadMessages()
    .value.filter((ur) => ur.idChannel === prop.item.id)
})

const channelType = computed(() => {
  const typeValidation = ChannelSchema.safeParse(prop.item)
  return typeValidation.success ? "MPU" : "SNG"
})

const color = computed(() => {
  return prop.item.color
    ? prop.item.color.trim()
    : "bg-gray-500 dark:bg-slate-800"
})

const channelAbbr = computed(() => {
  const abbrValidation = ChannelSchema.safeParse(prop.item)
  if (abbrValidation.success) {
    return abbrValidation.data.title.slice(0, 1)
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
  const channelValidation = ChannelSchema.safeParse(prop.item)
  if (channelValidation.success) {
    unreadMessageStore.removeUnreadMessages(prop.item.id)
    emits("open", prop.item.id, "MPU")
  } else {
    unreadMessageStore.removeUnreadMessages(prop.item.id)
    emits("open", prop.item.id, "SNG")
  }
}

onMounted(async () => {
  await channelUserStore.getChannelUsers(prop.item.id)
})
</script>
