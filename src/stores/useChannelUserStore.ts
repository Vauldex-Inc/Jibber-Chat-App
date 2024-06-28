import { ref, computed } from "vue"

import { defineStore } from "pinia"
import axios from "axios"

import { useFetch } from "@/composables/useFetch"

import { ChannelUserSchema, type ChannelUser } from "@/types/Channel"
import type { Channel } from "@/types/Channel"

export const useChannelUserStore = defineStore("channel-users", () => {
	const channelUsers = ref<[string, ChannelUser[]][]>([])
	const channelUsersCount = computed(() => {
		const copy = [...channelUsers.value]
		return copy.map(ch => {
			const [id, users] = ch
			return [id, users.length]
		})
	})


	const getChannelUsers = async (idChannel: string) => {
		const users: [string, ChannelUser[]] | undefined = channelUsers.value.find(c => c[0] === idChannel)

		if (!users) {
			try {
				const { data } = await axios.get(`/channels/${idChannel}/users`)
				const validation = ChannelUserSchema.array().safeParse(data.users)
				
				if (validation.success) {
					channelUsers.value.push([idChannel, validation.data])
					return validation.data
				} else {
					throw new Error("Unsupported Format")
				}
			} catch (error) {
				if (error instanceof Error) {
					console.error(error.message)
				}
			}
		} else {
			return users[1] as ChannelUser[]
		}
	}

	const addNewChannelUser = (user: ChannelUser) => {
		const chanUsers = channelUsers.value.find(c => c[0] === user.idChannel)

		if (!chanUsers) {
			channelUsers.value.push([user.idChannel, [user]])
		} else {
			channelUsers.value.map(ch => {
				const [id, users] = ch

				if (id === user.idChannel) {
					if (!users.find(u => u.idUser === user.idUser)) {
						users.push(user)
					}
				}

				return [id, users] as [string, ChannelUser[]]
			})
		}
	}

	const getChannelUsersCount = (idChannel: string) => {
		const userCountAndChannel = channelUsersCount.value.find((ch) => ch[0] === idChannel)
		if (userCountAndChannel)
			return userCountAndChannel[1] as number > 1 ? `${userCountAndChannel[1] as number} members` : `0 member`
	}

	const isMember = (idChannel: string, idUser: string) => {
		const users = channelUsers.value.find(c => c[0] === idChannel)
		// console.log("Here ", channelUsers.value)
		return users && users[1].find(u => u.idUser === idUser) !== undefined
	}

	const setChannelColor = async (channel: Channel, color: string): Promise<boolean | void> => {
		try {
			const res = await useFetch(`/channels/${channel.id}`, {
				method: "PUT",
				body: JSON.stringify({
					title: channel.title,
					channelType: channel.channelType,
					color: color,
				}),
			});
			return res.status === 200
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
			}
		}
	}


	return {
		channelUsers,
		getChannelUsers,
		isMember,
		addNewChannelUser,
		getChannelUsersCount,
		setChannelColor
	}
})