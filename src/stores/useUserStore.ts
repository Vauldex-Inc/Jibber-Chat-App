import { ref } from "vue"
import { defineStore } from "pinia"
import type { User } from "@/types/User"
import type { Message } from "@/types/Message"
import { useFetch } from "@/composables/useFetch"
import axios, { AxiosError } from "axios"
import { useDateFormatter } from "@/composables/useDateFormatter"

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

	const getUsers = () => {
		return users
	}

	const getUser = (idUser: string) => {
		return users.value.find((user) => user.id == idUser)
	}

	const getUserNameById = (id: string) => {
		const userProfile = getUser(id)

		if (!userProfile) {
			return "Anonymous"
		}

		const user = userProfile.user
		const profile = userProfile.profile

		if (!profile) {
			return user?.username
		}

		if (!profile.firstName && !profile.lastName) {
			return user?.username
		}

		if (profile.firstName?.trim() === "" || profile.lastName?.trim() === "") {
			return user?.username
		}

		return `${profile.firstName} ${profile.lastName}`
	}

	const getUserImageById = (id: string) => {
		const userProfile = getUser(id)

		if (!userProfile) {
			return undefined
		}

		const user = userProfile.user
		const profile = userProfile.profile

		if (!profile) {
			return undefined
		}
		return profile.image
	}

	const addUserProfile = (id: string, newProfile: Profile) => {
		const updatedUsers = [...users.value.map(u => {
			const [user, profile] = u
			if (user.id === id) {
				return [user, newProfile] as [User, Profile]
			}
			return [user, profile] as [User, Profile]
		})]

		users.value = [...updatedUsers]
	}

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
		users.value.push([user, undefined])
	}

	const sentAtFormatter = (message: Message, options: Intl.DateTimeFormatOptions = defaultOptions) => {
		return dateFormatter.format(message.sentAt, options)
	}

	const senderName = (userId?: string) => {
		return userId ? getUserNameById(userId) : "Anonymous";
	};

	const senderProfile = (userId: string) => {
		return userId ? getUserImageById(userId) : undefined;
	};

	const senderStatus = (userId?: string) => {
		if (userId && getOnlineUsers().value.includes(userId)) {
			return "online"
		}
		return "offline"
	}

	const getStatus = (userId?: string) => {
		if (userId && getOnlineUsers().value.includes(userId)) {
			return "online"
		}
		return "offline"
	}

	const inviteMember = async (idChannel: string, idSender: string) => {
		try {
			await useFetch(`/channels/${idChannel}/users`, {
				method: "POST",
				body: JSON.stringify({
					idUser: idSender,
				}),
			})``
		} catch (error) {
			throw new Error(`Error: ${error}`)
		}
	}

	return {
		users, init, getUser, getUsers, getUserNameById,
		getUserImageById, addUserProfile, updateUserOnlineAt, onlineUsers,
		getOnlineUsers, addNewUser, sentAtFormatter, senderName, senderProfile,
		senderStatus, getStatus, inviteMember
	}
})