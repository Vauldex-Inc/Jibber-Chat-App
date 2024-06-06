<template>
	<li 
		class="p-4 cursor-pointer" 
		:class="[{'bg-gray-900/10 dark:bg-gray-900/60 ' : notification.seenAt},
		{'hover:bg-gray-100 dark:hover:bg-slate-700' : !notification.seenAt}]" 
		@click="viewNotifInvite">
			<div class="flex justify-between" >
				<span>
					<span class="font-semibold dark:text-gray-300">{{ sender }}</span>
				</span>
				<span v-if="notification.seenAt" class="text-xs font-semibold">Seen at: {{isRead}}</span> 
				<span v-else class="text-xs font-semibold">{{ formattedSentAtDate }}</span>
			</div>
			<p v-if="notification.notificationType === 'INV'" class="text-gray-700 dark:text-gray-400">Invited you to join {{ channelName }}</p>
			<p v-else-if="notification.notificationType === 'NEW'" class="text-gray-700 dark:text-gray-400">Checkout this new channel!</p>

	</li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import type { Invitation } from "@/types/Notification"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelStore } from "@/stores/useChannelStore"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { formatSentAt } from "@/utils/formatSentAt"
import { useDateFormatter } from "@/composables/useDateFormatter"

const userStore = useUserStore()
const channelStore = useChannelStore()
const notificationStore = useNotificationStore()
const dateFormatter = useDateFormatter()

const options: Intl.DateTimeFormatOptions = {
	weekday: 'long',
	hour: 'numeric',
	hour12: true,
}

const isRead = computed(() => {
	const seenStatus = props.notification.seenAt
	if(seenStatus) {
		return dateFormatter.format(seenStatus, options)
	}	
	return seenStatus
})

const channelName = computed(() => {
	return channelStore.getChannelById(props.notification.channelId).title
})

const formattedSentAtDate = computed(() => {
	return formatSentAt(props.notification.sentAt)
})

const sender = computed(() => {
	return userStore.getUserNameById(props.notification.senderId)
})



const viewNotifInvite =  () => {
	notificationStore.setSelectedInvitation(props.notification)
	notificationStore.updateNotification(props.notification.id)
	emit('close')
}

const props = defineProps<{
	notification: Invitation
}>()

const emit = defineEmits<{
	close: []
}>()

</script>