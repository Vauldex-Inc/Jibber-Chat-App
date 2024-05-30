import {ref} from "vue"
import {defineStore} from "pinia"
import type {Message} from "@/types/Message.ts"
import {useFetch} from "@/composables/useFetch.ts"


export const useMessageStore = defineStore("messages", () => {
	const channelMessages = ref<[string,Message[]][]>([])


	const getChannelMessages = async (channelId: string) => {
		const messages = channelMessages.value.find(c => c[0] === channelId)

		if(!messages) {
			const res = await useFetch(`/channels/${channelId}/messages`)
			const data = (await res.json()).messages

			channelMessages.value.push([channelId,data])

			return data
		} else {
			return messages[1]
		}

	}

	const sendMessage = async (channelId:string, message: string) => {
		const res = await useFetch(`/channels/${channelId}/messages`, {
			method: "POST",
			body: JSON.stringify({text: message})
		})

		if(res.status === 200) {
			const data = (await res.json()).messages

			const updatedChannelMessages = channelMessages.value.map(cm => {
				const [id,messages] = cm

				if(id === channelId) {
					messages.push(data)
				}

				return [id,messages]
			})

			channelMessages.value = [...updatedChannelMessages]
		}
	}
	
	const updateMessages = (data: MessageEvent) => {
		const dataJson = JSON.parse(data.data)
		const newMessage = dataJson.messages

		const updatedChannelMessages = channelMessages.value.map(cm => {
			const [id,messages] = cm

			if(id === newMessage.channelId) {
				messages.push(newMessage)
			}

			return [id,messages]
		})

		channelMessages.value = [...updatedChannelMessages]
	}


	const getLatestMessage = async (channelId: string) => {
		const messages = await getChannelMessages(channelId)
		return messages[messages.length-1]
	}

	return {channelMessages,getChannelMessages,sendMessage,updateMessages,getLatestMessage}
})