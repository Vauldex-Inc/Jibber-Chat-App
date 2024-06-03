import {defineStore} from "pinia"
import {useFetch} from "@/composables/useFetch.ts"


export const useMessageStore = defineStore("messages", () => {

	const getChannelMessages = async (channelId: string) => {
			const res = await useFetch(`/channels/${channelId}/messages`)

			return (await res.json()).messages
	}

	const sendMessage = async (channelId:string, message: string, img: string | undefined) => {
		const res = await useFetch(`/channels/${channelId}/messages`, {
			method: "POST",
			body: JSON.stringify({
				text: message,
				image: img
			})
		})
	}

	return {getChannelMessages,sendMessage}
})