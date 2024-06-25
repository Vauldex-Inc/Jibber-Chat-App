import { ref, computed } from "vue"

import { defineStore } from "pinia"

import { useFetch } from "@/composables/useFetch"
import { useUser } from "@/composables/useUser"

import type { Channel } from "@/types/Channel.ts"
import { userSchema  } from "@/types/User";


export const useChannelStore = defineStore("channels", () => {
	const loggedUserId = userSchema.safeParse(useUser()).data?.id
	const channels = ref<Channel[]>([])

	const multiChannels = computed(() => {
		const copy = [...channels.value]
		return copy.filter(ch => 
			ch.channelType !== "SNG").sort((a, b) => a.title.localeCompare(b.title)
		)
	})

	const singleChannels = computed(() => {
		const copy = [...channels.value]
		return copy.filter(ch => 
			ch.channelType === "SNG").sort((a, b) => a.title.localeCompare(b.title)
		)
	})

	const privateChannels = computed(() => {
		return singleChannels.value.filter((s) => {
			const users = s.title.split("/");
	
			return users.some((u) => u === loggedUserId);
		});
	})

	const init = async () => {
		const res = await useFetch("/channels")
		const data = (await res.json())
		
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

	return { 
		channels, 
		multiChannels, 
		singleChannels, 
		privateChannels, 
		init, 
		getMultiChannels,
		getSingleChannels, 
		getChannelById, 
		addNewChannel, 
		updateChannel 
	}
})