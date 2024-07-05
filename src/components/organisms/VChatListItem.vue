<template>
  <li
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
        :image="profileStore.getImage(user)"
        :status="userStore.getStatus(user)"
        size="xlarge"
      />
      <VTextGroup
        :is-bold="unReadMessages.length > 0"
        class="flex-1"
        :title="profileStore.getName(user)"
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
  </li>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { formatSentAt } from "@/composables/useDateFormatter"
import { useUser } from "@/composables/useUser"
import { useMessageStore } from "@/stores/useMessageStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useUserStore } from "@/stores/useUserStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import VAvatar from "@/components/molecules/VAvatar.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"
import {
  DirectChannelSchema,
  PublicChannelSchema,
  type DirectChannel,
  type PublicChannel,
} from "@/types/Channel"

const prop = defineProps<{ item: PublicChannel | DirectChannel }>()

const emits = defineEmits<{
  open: [channel: PublicChannel | DirectChannel]
}>()

const loggedUser = useUser()
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
  const typeValidation = PublicChannelSchema.safeParse(prop.item)
  return typeValidation.success ? "MPU" : "SNG"
})

const user = computed(() => {
  const validation = DirectChannelSchema.safeParse(prop.item)
  
  if (validation.success) {
    if (loggedUser?.id === validation.data.idUser) {
      return validation.data.idReceiver
    } else {
      return validation.data.idUser
    }
  } else {
    return prop.item.idUser
  }
})

const color = computed(() => {
  return prop.item.color
    ? prop.item.color.trim()
    : "bg-gray-500 dark:bg-slate-800"
})

const channelAbbr = computed(() => {
  const abbrValidation = PublicChannelSchema.safeParse(prop.item)
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
  const channelValidation = PublicChannelSchema.safeParse(prop.item)
  if (channelValidation.success) {
    unreadMessageStore.removeUnreadMessages(channelValidation.data.id)
    emits("open", channelValidation.data)
  } else {
    unreadMessageStore.removeUnreadMessages(prop.item.id)
    emits("open", prop.item)
  }
}

onMounted(async () => {
  await channelUserStore.getChannelUsers(prop.item.id)
})
</script>
