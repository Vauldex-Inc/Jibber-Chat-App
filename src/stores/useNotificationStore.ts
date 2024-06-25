import { ref } from "vue"
import { defineStore } from "pinia"
import { useFetch } from "@/composables/useFetch"
import type { Invitation } from "@/types/Notification"

const useNotificationStore = defineStore("notifications", () => {
	const notifications = ref<Invitation[] | undefined>([])
	const selectedInvitation = ref<Invitation | undefined>(undefined)

	const init = async () => {
		try {
			const res = await useFetch("/notifications")
			const data = (await res.json()).notifications
			notifications.value = data
		} catch (error) {
			if (typeof error == "string") throw new Error(error)
		}

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
		notifications.value?.push(notification)
	}

	const updateNotification = async (id: string) => {
		try {
			const response = await useFetch(`/channels/${id}/notifications`, { "method": "POST" })
			if (response.status === 200) {
				const foundNotif = notifications.value?.find((n) => n.id === id)
				if (foundNotif)
					foundNotif.seenAt = new Date().toISOString()

				return true
			}
		} catch (error) {
			if (typeof error == "string") throw new Error(error)
		}

	}

	return { notifications, init, getNotifications, setSelectedInvitation, getSelectedInvitation, addNewNotification, updateNotification }
})

export { useNotificationStore }