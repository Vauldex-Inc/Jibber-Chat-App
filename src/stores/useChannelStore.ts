import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import {type ZodError } from "zod"
import { 
  type ChannelType,
  type ChannelUser, 
  ChannelUserSchema, 
	type DirectChannel,
	type Channel} from "@/types/Channel"
import type { User } from "@/types/User"
import { useUser } from "@/composables/useUser"

export const useChannelStore = defineStore("channels", () => {
  const _channel = ref<ChannelType>({} as ChannelType)
  const _users = ref<[string, ChannelUser[]][]>([])
	const loggedUser = useUser()

  const channel = computed(() => _channel.value)
  const channelUsers = computed(() => _users.value)

	const userId = computed(() => {
		if ('idReceiver' in channel.value) {
			return loggedUser?.id === channel.value.idUser ? channel.value.idReceiver : channel.value.idUser
		} else {
			return channel.value.idUser
		}
	})

  const channelUsersCount = computed(() => {
		const copy = [..._users.value]
		return copy.map(ch => {
			const [id, users] = ch
			return [id, users.length]
		})
	})
  const set = async (channel: ChannelType) => { 
		_channel.value = channel
		getChannelUsers(channel.id)
	}

  const changeTheme = async (color: string) => {
    try {
      const response = await axios.put(`/channels/${channel.value.id}`, {
        title: channel.value.title,
        channelType: channel.value.channelType,
        color
      })
			_channel.value.color = color
      return response.status
    } catch (e) {
      const error = e as AxiosError | ZodError
      console.error(error.message)
    }
  }

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

	const archiveChannel = async (channel: Channel | DirectChannel, archivedAt: string) => {
		try {
			await axios.put(`/channels/${channel.id}`, {
				title: channel.title,
				channelType: channel.channelType,
				color: undefined,
				archivedAt: archivedAt,
			})
		} catch (e) {
			const error = e as AxiosError
			console.error(error.message)
		}
	}

	const channelInitials = computed(() => {
		return _channel.value.title?.slice(0,1)
	})

  return {
    channel,
		channelUsers,
    changeTheme,
    getChannelUsers,
    addNewChannelUser,
    getChannelUsersCount,
    isMember,
    getNonMembers,
    set,
		archiveChannel,
		channelInitials,
		userId
  }
})