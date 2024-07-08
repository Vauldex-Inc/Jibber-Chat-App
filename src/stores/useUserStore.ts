import { computed, ref } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { useDateFormatter } from "@/composables/useDateFormatter"
import { type User, StatusSchema } from "@/types/User"
import type { Message } from "@/types/Message"

const dateFormatter = useDateFormatter()
const defaultOptions: Intl.DateTimeFormatOptions = {
	month: "long",
	day: "numeric",
	weekday: "long",
	hour: "numeric",
	minute: "numeric",
	hour12: true,
}

export const useUserStore = defineStore("users", () => {
	const users = ref<User[]>([])
	const onlineUsers = ref<string[]>([])

	const init = async () => {
		try {
			const { data } = await axios.get("/users")
			const result = data.users
			users.value = result
		} catch (e) {
			const error = e as AxiosError
			console.error(error)
		}
	}

	const getUsers = computed(() => users)

	const getUser = (idUser: string) => users.value.find((user) => user.id == idUser)

	const updateUserOnlineAt = (users: string[], type: string) => {
		if (type === "online") {
			onlineUsers.value = users
		} else {
			onlineUsers.value = [...onlineUsers.value.filter(ol => users.indexOf(ol) === -1)]
		}
	}

	const getOnlineUsers = () => {
		return onlineUsers
	}

	const addNewUser = (user: User) => {
		users.value.push(user)
	}

	const sentAtFormatter = (message: Message, options: Intl.DateTimeFormatOptions = defaultOptions) => {
		return dateFormatter.format(message.sentAt, options)
	}

	const getStatus = (userId?: string) => {
		if (userId && getOnlineUsers().value.includes(userId)) {
			return StatusSchema.enum.online
		}
		return StatusSchema.enum.offline
	}


	const inviteMember = async (idChannel: string, idSender: string) => {
		try {
			await axios.post(`/channels/${idChannel}/users`, {
				idUser: idSender,
			})
		} catch (e) {
			throw new Error(`Error: ${e}`)
		}
	}

	return {
		users, 
		init, 
		getUser, 
		getUsers, 
		getStatus, 
		updateUserOnlineAt, 
		onlineUsers,
		getOnlineUsers, 
		addNewUser, 
		sentAtFormatter, 
		inviteMember
	}
})
