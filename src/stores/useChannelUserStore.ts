import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { ChannelUserSchema, type ChannelUser, ChannelSchema } from "@/types/Channel"
import type { Channel, DirectChannel } from "@/types/Channel"
import type { User } from "@/types/User"
import type { ZodError } from "zod"
import { useChannelStore } from "./useChannelStore"

export const useChannelUserStore = defineStore("channel-users", () => {
	type ChannelType = Channel | DirectChannel
	const users = ref<[string, ChannelUser[]][]>([])
	const _channel = ref<ChannelType>({} as ChannelType) // currently opened or actived channel (direct | public)

	const channelUsersCount = computed(() => {
		const copy = [...users.value]
		return copy.map(ch => {
			const [id, users] = ch
			return [id, users.length]
		})
	})

	const channel = computed(() => _channel.value)
	// continue
	// const opeChannel = (id: string) => {
	// 	_channel.value = id
	// }


	const getChannelUsers = async (idChannel: string) => {
		const channelUsers: [string, ChannelUser[]] | undefined = users.value.find(c => c[0] === idChannel)

		if (!channelUsers) {
			try {
				const { data } = await axios.get(`/channels/${idChannel}/users`)
				const validation = ChannelUserSchema.array().safeParse(data.users)

				if (validation.success) {
					users.value.push([idChannel, validation.data])
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
			return channelUsers[1] as ChannelUser[]
		}
	}

	const addNewChannelUser = (user: ChannelUser) => {
		const channelUsers = users.value.find(c => c[0] === user.idChannel)

		if (!channelUsers) {
			users.value.push([user.idChannel, [user]])
		} else {
			users.value.map(ch => {
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
		const channelUsers = users.value.find(c => c[0] === idChannel)
		return users && channelUsers?.[1].find(u => u.idUser === idUser) !== undefined
	}


	const getNonMembers = (idChannel: string, channelUsers: User[]) => {
		const foundChannelUser = users.value.find((channelUser) => channelUser[0] === idChannel)

		if (foundChannelUser) {
			return channelUsers.filter((user) => {
				return foundChannelUser[1].every((channelUser) => {
					return channelUser.idUser !== user.id
				})
			})
		}

	}

	const setChannelColor = async (channel: Channel | DirectChannel, color: string): Promise<number | void> => {
		try {
			const validation = ChannelSchema.safeParse(channel)
			if (validation.success) {
				const response = await axios.put(`/channels/${validation.data.id}`, {
					title: validation.success ? validation.data.title : "",
					channelType: validation.success ? "MPU" : "SNG",
					color: color,
				})
				return response.status
			} else {
				throw new Error("Failed to update")
			}
		} catch (e) {
			const error = e as AxiosError | ZodError
			console.error(error.message)
		}
	}


	return {
		channel,
		getChannelUsers,
		isMember,
		getNonMembers,
		addNewChannelUser,
		getChannelUsersCount,
		setChannelColor
	}
})
