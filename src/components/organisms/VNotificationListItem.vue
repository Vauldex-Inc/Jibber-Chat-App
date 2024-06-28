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
    <p
      v-if="invitation.notificationType === 'INV'"
      class="text-gray-700 dark:text-gray-400"
    >
      Invited you to join {{ channelName }}
    </p>
    <p
      v-else-if="invitation.notificationType === 'NEW'"
      class="text-gray-700 dark:text-gray-400"
    >
      Checkout this new channel!
    </p>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useDateFormatter } from "@/composables/useDateFormatter"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelStore } from "@/stores/useChannelStore"
import { useNotificationStore } from "@/stores/useNotificationStore"
import type { Invitation } from "@/types/Notification"
import { formatSentAt } from "@/composables/useDateFormatter"

const props = defineProps<{
  invitation: Invitation
}>()

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const channelStore = useChannelStore()
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

const channelName = computed(() => {
  const channel = channelStore.getChannelById(props.invitation.idChannel)
  return channel?.title
})

const formattedSentAtDate = computed(() => {
  return formatSentAt(props.invitation.sentAt)
})

const sender = computed(() => {
  return userStore.getUserNameById(props.invitation.idUser)
})

const viewNotifInvite = () => {
  notificationStore.setSelectedInvitation(props.invitation)
  notificationStore.updateNotification(props.invitation.id)
  emit("close")
}
</script>
