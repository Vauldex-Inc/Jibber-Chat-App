import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { ChannelUserSchema, type ChannelUser, ChannelSchema } from "@/types/Channel"
import type { Channel, DirectChannel } from "@/types/Channel"
import type { User } from "@/types/User"

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
			} catch (e) {
				const error = e as AxiosError
				console.error(error)
			}
		}
		else {
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
		return users && users[1].find(u => u.idUser === idUser) !== undefined
	}


	const getNonMembers = (idChannel: string, users: User[]) => {
		const foundChannelUser = channelUsers.value.find((channelUser) => channelUser[0] === idChannel)

		if (foundChannelUser) {
			return users.filter((user) => {
				return foundChannelUser[1].every((channelUser) => {
					return channelUser.idUser !== user.id
				})
			})
		}

	}

	const setChannelColor = async (channel: Channel | DirectChannel, color: string): Promise<number | void> => {
		try {
			const validation = ChannelSchema.safeParse(channel)
			const response = await axios.put(`/channels/${channel.id}`, {
				title: validation.success ? validation.data.title : "",
				channelType: validation.success ? "MPU" : "SNG",
				color: color,
			})
			return response.status
		} catch (e) {
			const error = e as AxiosError
			console.error(error)
		}
	}


	return {
		channelUsers,
		getChannelUsers,
		isMember,
		getNonMembers,
		addNewChannelUser,
		getChannelUsersCount,
		setChannelColor
	}
})