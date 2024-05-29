import {ref,computed} from "vue"
import {defineStore} from "pinia"
import type {Channel} from "@/types/Channel.ts"
import {useFetch} from "@/composables/useFetch.ts"


export const useChannelStore = defineStore("channels", () => {
	const channels = ref<Channel[]>([])
	const multiChannels = computed(() => {
		return channels.value.filter(ch => ch.channelType !== "SNG")
	})
	const singleChannels = computed(() => {
		return channels.value.filter(ch => ch.channelType === "SNG")
	})

	const init = async () => {
		const res = await useFetch("/channels")
		const data = (await res.json()).channels

		channels.value = data
	}

	const getMultiChannels = () => {
		return multiChannels
	}

	const getSingleChannels = () => {
		return singleChannels
	}

	const getChannelById = (channelId: string) => {
		return channels.value.find(c => c.id === channelId)
	}

	return {channels,multiChannels,singleChannels,init,getMultiChannels,getSingleChannels,getChannelById}
})