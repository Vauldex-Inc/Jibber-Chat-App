import { ref } from "vue"
import { defineStore } from "pinia"
import axios from "axios"
import { UnreadMessageSchema, type UnreadMessage } from "@/types/Message"
import type { AxiosError } from "axios"
import type { ZodError } from "zod"

export const useUnreadMessageStore = defineStore("unread-messages", () => {

	const unreadMessages = ref<UnreadMessage[]>([])

	const init = async () => {
		try {
			const { data } = await axios.get("/users/unread-messages")
			const validation = UnreadMessageSchema.array().safeParse(data.unreadMessages)
			if (validation.success) {
				unreadMessages.value = validation.data
			}
		} catch (e) {
			const error = e as AxiosError | ZodError
			console.error(error.message)
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

