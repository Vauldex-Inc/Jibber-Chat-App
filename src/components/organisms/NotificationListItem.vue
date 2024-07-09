<template>
  <li
    class="cursor-pointer p-4"
    :class="[
      { 'bg-gray-900/10 dark:bg-gray-900/60': invitation.seenAt },
      { 'hover:bg-gray-100 dark:hover:bg-slate-700': !invitation.seenAt },
    ]"
    @click="viewNotifInvite"
  >
    <div class="flex justify-between">
      <span>
        <span class="font-semibold dark:text-gray-300">{{ sender }}</span>
      </span>
      <span v-if="invitation.seenAt" class="text-xs font-semibold"
        >Seen at: {{ isRead }}</span
      >
      <span v-else class="text-xs font-semibold">{{
        formattedSentAtDate
      }}</span>
    </div>
    <p v-if="!isNew" class="text-gray-700 dark:text-gray-400">
      Invited you to join {{ channelName }}
    </p>
    <p v-else class="text-gray-700 dark:text-gray-400">
      Checkout this new channel!
    </p>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { formatSentAt } from "@/composables/useDateFormatter"
import { useDateFormatter } from "@/composables/useDateFormatter"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useProfileStore } from "@/stores/useProfileStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import type { Invitation } from "@/types/Notification"

const props = defineProps<{
  invitation: Invitation
}>()
const emit = defineEmits<{
  close: []
}>()

const userProfileStore = useProfileStore()
const publicChannelStore = usePublicChannelStore()
const notificationStore = useNotificationStore()
const dateFormatter = useDateFormatter()
const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  hour: "numeric",
  hour12: true,
}

const isRead = computed(() => {
  const seenStatus = props.invitation.seenAt
  if (seenStatus) {
    return dateFormatter.format(seenStatus, options)
  }
  return seenStatus
})

const isNew = computed(() => props.invitation.notificationType === 'NEW')

const channelName = computed(() => {
  const channel = publicChannelStore.getChannelById(props.invitation.idChannel)
  return channel?.title
})

const formattedSentAtDate = computed(() => {
  return formatSentAt(props.invitation.sentAt)
})

const sender = computed(() => {
  return userProfileStore.getName(props.invitation.idSender)
})

const viewNotifInvite = () => {
  notificationStore.setSelectedInvitation(props.invitation)
  notificationStore.updateNotification(props.invitation.id)
  emit("close")
}
</script>
