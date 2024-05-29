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

	return {channelMessages,getChannelMessages}
})