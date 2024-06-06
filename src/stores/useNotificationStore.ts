import { ref } from "vue"
import { defineStore } from "pinia"
import { useFetch } from "@/composables/useFetch"
import type { Invitation } from "@/types/Channel"

const useNotificationStore = defineStore("notifications", () => {
	const notifications = ref([])
	const selectedInvitation = ref<Invitation | undefined>(undefined)

	const init = async () => {
		try {
			const res = await useFetch("/users/invites")
			const data = (await res.json()).notifications
			notifications.value = data
		} catch (error) {
			throw new Error(error)
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
		notifications.value.push(notification)
	}

	const updateNotification = async (id: string) => {
		try {
			const response = await useFetch(`/users/invites/${id}`, {"method": "POST"})
			if(response.status === 200) {
				const foundNotif = notifications.value.find((n) => {
					return n.id === id
				})
				foundNotif.seenAt = new Date().toISOString()

				return true
			}
		} catch(error) {
			throw new Error(error)
		}

	}

	return { notifications, init, getNotifications, setSelectedInvitation, getSelectedInvitation, addNewNotification, updateNotification }
})

export { useNotificationStore }