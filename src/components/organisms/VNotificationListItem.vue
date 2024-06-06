<template>
	<li class="hover:bg-gray-100 dark:hover:bg-slate-700 p-4 cursor-pointer" :class="{'bg-gray-300' : isRead}" @click="viewNotifInvite">
			<div class="flex justify-between" >
				<span>
					<span class="font-semibold dark:text-gray-300">{{ sender }}</span>
					<span v-if="notification.seenAt" class="text-sm font-semibold">{{notification.seenAt}}</span> 
				</span>
				<span class="text-xs font-semibold">{{ formattedSentAtDate }}</span>
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

const userStore = useUserStore()
const channelStore = useChannelStore()
const notificationStore = useNotificationStore()

const isRead = computed(() => {
	return props.notification.seenAt
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

const props = defineProps<{
	notification: Invitation
}>()

const viewNotifInvite = () => {
	notificationStore.setSelectedInvitation(props.notification)
	emit('close')
}

const emit = defineEmits<{
	close: []
}>()

</script>