import { ref } from "vue"
import { defineStore } from "pinia"
import { useFetch } from "@/composables/useFetch"
import { UnreadMessageSchema, type UnreadMessage } from "@/types/Message"

export const useUnreadMessageStore = defineStore("unread-messages", () => {

	const unreadMessages = ref<UnreadMessage[]>([])

	const init = async () => {
		try {
			const res = await useFetch("/users/unread-messages")
			const data = (await res.json()).unreadMessages
			const validation = UnreadMessageSchema.array().safeParse(data)
			if (validation.success) {
				unreadMessages.value = validation.data
			} else {
				throw new Error("Unknown Format")
			}

		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
			}
		}
	}

	const addUnreadMessage = (message: UnreadMessage) => {
		unreadMessages.value.push(message)
	}

	const getUnreadMessages = (idChannel: string) => {
		return unreadMessages.value.filter((ur) => ur.idChannel === idChannel)
	}

	const removeUnreadMessages = (idChannel: string) => {
		unreadMessages.value = [...unreadMessages.value.filter(um => um.idChannel !== idChannel)]
	}

	const hasUnread = (idChannel: string) => getUnreadMessages(idChannel).length > 0

	return { 
		unreadMessages, 
		init, 
		getUnreadMessages, 
		addUnreadMessage, 
		removeUnreadMessages ,
		hasUnread
	}
})

