import { ref, computed } from "vue"

import { defineStore } from "pinia"

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



	const getChannelUsers = async (channelId: string) => {
		const users = channelUsers.value.find(c => c[0] === channelId)

		if (!users) {

			try {
				const res = await useFetch(`/channels/${channelId}/users`)
				const data = (await res.json()).users
				const validation = ChannelUserSchema.array().safeParse(data)

				if(validation.success) {
					channelUsers.value.push([channelId, data])
					return data
				} else {
					throw new Error("Unsupported Format")
				}
			} catch (error) {
				if(error instanceof Error) {
					console.error(error.message)
				}
			}
		} else {
			return users[1]
		}

	}

	const addNewChannelUser = (user: ChannelUser) => {
		const chanUsers = channelUsers.value.find(c => c[0] === user.channelId)

		if (!chanUsers) {
			channelUsers.value.push([user.channelId, [user]])
		} else {
			channelUsers.value.map(ch => {
				const [id, users] = ch

				if (id === user.channelId) {
					if (!users.find(u => u.userId === user.userId)) {
						users.push(user)
					}
				}

				return [id, users]
			})
		}
	}

	const getChannelUsersCount = (channelId: string) => {
		const userCountAndChannel = channelUsersCount.value.find((ch) => ch[0] === channelId)
		if (userCountAndChannel)
			return userCountAndChannel[1] as number > 1 ? `${userCountAndChannel[1] as number} members` : `0 member`
	}

	const isMember = (channelId: string, userId: string) => {
		const users = channelUsers.value.find(c => c[0] === channelId)

		return users && users[1].find(u => u.userId === userId) !== undefined
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