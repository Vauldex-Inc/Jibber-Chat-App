import { ref } from "vue"
import { defineStore } from "pinia"
import { useFetch } from "@/composables/useFetch"
import type { Invitation } from "@/types/Channel"

const useNotificationStore = defineStore("notifications", () => {
	const notifications = ref([])
	const selectedInvitation = ref<Invitation | undefined>(undefined)

	const init = async () => {
		const res = await useFetch("/users/invites")
		const data = (await res.json()).notifications
		notifications.value = data
	}

	const getNotifications = () => {
		return notifications
	}

	const setSelectedInvitation = (notification: Invitation) => {
		selectedInvitation.value = notification
	}

	const getSelectedInvitation = () => {
		return selectedInvitation
	}

	const addNewNotification = (notification: Invitation) => {
		notifications.value.push(notification)
	}

	return { notifications, init, getNotifications, setSelectedInvitation, getSelectedInvitation, addNewNotification }
})

export { useNotificationStore }