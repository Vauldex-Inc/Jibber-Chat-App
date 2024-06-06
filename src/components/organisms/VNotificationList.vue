<template>
	<div class="relative">
		<VIconButton icon="./src/assets/images/notification-bell.svg" :invert="true" :rounded="true" @click="toggleNotifications">
		</VIconButton>
		<div v-if="displayNotification" class="absolute py-5 px-2 bottom-0 left-2 translate-y-full bg-white shadow-xl z-30 rounded-md dark:bg-slate-800">
			<ul v-if="notifications" @mouseleave="toggleNotifications" class="w-[28rem] max-h-80 overflow-y-scroll divide-y dark:divide-slate-700">
				<VNotificationListItem v-for="notification in notificationsCopy" :key="notification.id" :notification="notification" @close="toggleNotifications" />
			</ul>
			<div v-else>
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

const notificationStore = useNotificationStore()

const displayNotification = ref<boolean>(false)
const toggleNotifications = () => {
	displayNotification.value = !displayNotification.value
}

const notificationsCopy = computed(() => {
	return [...notifications.value].reverse()
})
const notifications = notificationStore.getNotifications()
</script>