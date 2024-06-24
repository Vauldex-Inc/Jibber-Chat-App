import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { Channel } from "@/types/Channel.ts"
import { useFetch } from "@/composables/useFetch"


export const useChannelStore = defineStore("channels", () => {
	const channels = ref<Channel[]>([])
	const multiChannels = computed(() => {
		const copy = [...channels.value]
		return copy.filter(ch => ch.channelType !== "SNG").sort((a, b) => a.title.localeCompare(b.title))
	})
	const singleChannels = computed(() => {
		const copy = [...channels.value]
		return copy.filter(ch => ch.channelType === "SNG").sort((a, b) => a.title.localeCompare(b.title))
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

	const addNewChannel = (channel: Channel) => {
		channels.value.push(channel)
	}

	const updateChannel = (channelId: string, color?: string, archivedAt?: string) => {
		channels.value.map(c => {
			if (c.id === channelId) {
				c.color = color ? color : c.color
				c.archivedAt = archivedAt ? archivedAt : c.archivedAt
			}

			return c
		})
	}

	return { channels, multiChannels, singleChannels, init, getMultiChannels, getSingleChannels, getChannelById, addNewChannel, updateChannel }
})