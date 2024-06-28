import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { useUser } from "@/composables/useUser"

import type { Channel } from "@/types/Channel"
import { userSchema } from "@/types/User";


export const useChannelStore = defineStore("channels", () => {
	const loggedUserId = userSchema.safeParse(useUser()).data?.id
	const channels = ref<Channel[]>([])

	const init = async () => {
		try {
			const { data } = await axios.get("/channels")
			channels.value = data
		} catch (e) {
			const error = e as AxiosError
			console.error(error)
		}
	}

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



	const getMultiChannels = () => {
		return multiChannels
	}

	const getSingleChannels = () => {
		return singleChannels
	}

	const getChannelById = (idChannel: string) => {
		return channels.value.find(c => c.id === idChannel)
	}

	const addNewChannel = (channel: Channel) => {
		channels.value.push(channel)
	}

	const updateChannel = (idChannel: string, color?: string, archivedAt?: string) => {
		channels.value.map(c => {
			if (c.id === idChannel) {
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