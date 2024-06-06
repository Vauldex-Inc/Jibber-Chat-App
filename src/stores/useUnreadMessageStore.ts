import {defineStore} from "pinia"
import {ref} from "vue"
import {useFetch} from "@/composables/useFetch.ts"
import type {UnreadMessage} from "@/types/Message"


export const useUnreadMessageStore = defineStore("unread-messages", () => {

	const unreadMessages = ref<UnreadMessage[]>([])

	const init = async () => {
		const res = await useFetch("/users/unread-messages")
		const data = (await res.json()).unreadMessages

		unreadMessages.value = data
	}

	const addUnreadMessage = (message: UnreadMessage) => {
		unreadMessages.value.push(message)
	}

	const getUnreadMessages = () => {
		return unreadMessages
	}

	const removeUnreadMessages = (channelId: string) => {
		unreadMessages.value = [...unreadMessages.value.filter(um => um.channelId !== channelId)]
	}

	return {unreadMessages,init,getUnreadMessages,addUnreadMessage,removeUnreadMessages}
})

