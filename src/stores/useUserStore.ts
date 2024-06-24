import { ref } from "vue"
import { defineStore } from "pinia"
import type { User } from "@/types/User.ts"
import type { Profile } from "@/types/Profile.ts"
import type { Message } from "@/types/Message"
import { useFetch } from "@/composables/useFetch"
import { useDateFormatter } from "@/composables/useDateFormatter";

const dateFormatter = useDateFormatter()

const defaultOptions: Intl.DateTimeFormatOptions = {
	month: "long",
	day: "numeric",
	weekday: "long",
	hour: "numeric",
	minute: "numeric",
	hour12: true,
};

export const useUserStore = defineStore("users", () => {
	const users = ref<[User, Profile | undefined][]>([])
	
	const onlineUsers = ref<string[]>([])

	const init = async () => {
		const res = await useFetch("/users")
		const data = (await res.json()).users

		users.value = data
	}

	const getUserById = (id: string) => {
		return users.value.find(u => u[0].id === id)
	}

	const getUsers = () => {
		return users
	}

	const getUserNameById = (id: string) => {
		const userProfile = getUserById(id)

		if (!userProfile) {
			return "Anonymous"
		}

		const [user, profile] = userProfile

		if (!profile) {
			return user.username
		}

		if (!profile.firstName && !profile.lastName) {
			return user.username
		}


		if (profile.firstName?.trim() === "" || profile.lastName?.trim() === "") {
			return user.username
		}

		return `${profile.firstName} ${profile.lastName}`
	}

	const getUserImageById = (id: string) => {
		const userProfile = getUserById(id)

		if (!userProfile) {
			return undefined
		}

		const [user, profile] = userProfile

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
		return dateFormatter.format(message.sentAt, options);
	};

	const senderName = (message: Message) => {
		return getUserNameById(message.userId);
	};

	const senderProfile = (message: Message) => {
		return getUserImageById(message.userId);
	};

	const senderStatus = (message: Message) => {
		return getOnlineUsers().value.includes(message.userId)
			? "online"
			: "offline";
	};

	const getStatus = (sender?: string) => {
		console.log("here", sender)
		if (sender)
			return getOnlineUsers().value.indexOf(sender) !== -1
				? "online"
				: "offline";
	}

	return {
		users, init, getUserById, getUsers, getUserNameById,
		getUserImageById, addUserProfile, updateUserOnlineAt, onlineUsers, getOnlineUsers, addNewUser, sentAtFormatter, senderName, senderProfile, senderStatus, getStatus
	}
})