<template>
	<div class="relative">
		<VIconButton icon="./src/assets/images/notification-bell.svg" :invert="true" :rounded="true" @click="toggleNotifications"/>
		<span v-if="unSeenCount > 0" class="absolute bottom-0 right-0 py-0.5 px-1 rounded-full bg-red-500 text-xs text-white">
			{{unSeenCount}}
		</span>
		<div v-if="displayNotification" @mouseleave="displayNotification = false" class="absolute py-5 px-2 bottom-0 left-2 translate-y-full bg-white shadow-xl z-30 rounded-md dark:bg-slate-800">
			<ul v-if="notificationsCopy.length > 0" @mouseleave="toggleNotifications" class="w-[28rem] max-h-80 overflow-y-scroll divide-y dark:divide-slate-700">
				<VNotificationListItem v-for="notification in notificationsCopy" :key="notification.id" :notification="notification" @close="toggleNotifications" />
			</ul>
			<div v-else class="py-5 mx-3 rounded-md bg-gray-100 dark:bg-slate-700 w-[28rem] max-h-80 text-center">
				 No Notifications
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import VModal from "@/components/atoms/VModal.vue"
import VNotificationListItem from "@/components/organisms/VNotificationListItem.vue"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useChannelStore } from "@/stores/useChannelStore"

const notificationStore = useNotificationStore()
const channelStore = useChannelStore()

const displayNotification = ref<boolean>(false)
const toggleNotifications = () => {
	displayNotification.value = !displayNotification.value
}

const unSeenCount = computed(() => {
	return notificationsCopy.value.filter(n => n.seenAt === undefined).length
})

const notificationsCopy = computed(() => {
	return notifications.value.filter((n) => {
		const channel = channelStore.getChannelById(n.channelId)

		return channel.channelType !== "SNG"
	}).reverse()
})
const notifications = notificationStore.getNotifications()
</script>