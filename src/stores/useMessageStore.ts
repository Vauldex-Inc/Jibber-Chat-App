import { defineStore } from "pinia"
import { useFetch } from "@/composables/useFetch"
import { ref } from "vue"
import type { Message } from "@/types/Message"


export const useMessageStore = defineStore("messages", () => {
	const latestMessages = ref<(Message | null)[]>([])

	const init = async () => {
		const res = await useFetch("/channels/latest-messages")
		const data = (await res.json()).latestMessages

		latestMessages.value = data
	}

	const getChannelMessages = async (channelId: string) => {
		const res = await useFetch(`/channels/${channelId}/messages`)

		return (await res.json()).messages
	}

	const sendMessage = async (channelId: string, message: string, img: string | undefined) => {
		const res = await useFetch(`/channels/${channelId}/messages`, {
			method: "POST",
			body: JSON.stringify({
				text: message,
				image: img
			})
		})

		if (res.status === 200) {
			const data = (await res.json()).messages
			latestMessages.value.push(data)
		}
	}

	const addNewLatestMessage = (message: Message) => {
		latestMessages.value.push(message)
	}

	const getLatestMessages = () => {
		return latestMessages
	}

	return { getChannelMessages, sendMessage, latestMessages, init, getLatestMessages, addNewLatestMessage }
})