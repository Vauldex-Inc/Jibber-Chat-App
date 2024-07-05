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

export const useChannelStore = defineStore("channels", () => {
  // makes the state private
  const _channel = ref<ChannelType>({} as ChannelType)
  const _users = ref<[string, ChannelUser[]][]>([])

  const channel = computed(() => _channel.value) // current channel
  const channelUsers = computed(() => _users.value)

  const channelUsersCount = computed(() => {
		const copy = [..._users.value]
		return copy.map(ch => {
			const [id, users] = ch
			return [id, users.length]
		})
	})

  // use this every click of the direct channel or public channel
  const set = (channel: ChannelType) => {
		_channel.value = channel
		console.log(_channel.value)
	} 
  const changeTheme = async (color: string) => {
    try {
      const response = await axios.put(`/channels/${channel.value.id}`, {
        title: channel.value.title,
        channelType: channel.value.channelType,
        color
      })

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

  return {
    channel,
    changeTheme,
    getChannelUsers,
    addNewChannelUser,
    getChannelUsersCount,
    isMember,
    getNonMembers,
    set,
		archiveChannel
  }
})



// import { ref, computed } from "vue"
// import { defineStore } from "pinia"
// import type { ZodError } from "zod"
// import axios, { AxiosError } from "axios"
// import { useUserProfileStore } from "./useUserProfileStore"
// import { useUser } from "@/composables/useUser"
// import type { Channel, DirectChannel } from "@/types/Channel"
// import { ChannelSchema } from "@/types/Channel"
// import { UserSchema } from "@/types/User";


// export const useChannelStore = defineStore("channels", () => {
//  const loggedUserId = UserSchema.safeParse(useUser()).data?.id
//  const userProfileStore = useUserProfileStore()
//  const channels = ref<Channel[]>([])

//  const init = async () => {
//    try {
//      const { data } = await axios.get("/channels")
//      channels.value = data
//    } catch (e) {
//      const error = e as AxiosError
//      console.error(error)
//    }
//  }

//  const multiChannels = computed(() => {
//    const copy = [...channels.value]
//    return copy.filter(ch =>
//      ch.channelType !== "SNG").sort((a, b) => a.title.localeCompare(b.title)
//      )
//  })

//  const singleChannels = computed(() => {
//    const copy = [...channels.value]
//    return copy.filter(ch =>
//      ch.channelType === "SNG").sort((a, b) => a.title.localeCompare(b.title)
//      )
//  })

//  const privateChannels = computed(() => {
//    return singleChannels.value.filter((s) => {
//      const users = s.title.split("/");

//      return users.some((u) => u === loggedUserId);
//    });
//  })



//  const getMultiChannels = () => {
//    return multiChannels
//  }

//  const getSingleChannels = () => {
//    return singleChannels
//  }

//  const getChannelById = (idChannel: string) => {
//    return channels.value.find(c => c.id === idChannel)
//  }

//  const addNewChannel = (channel: Channel) => {
//    channels.value.push(channel)
//  }

//  const updateChannel = (idChannel: string, color?: string, archivedAt?: string) => {
//    channels.value.map(c => {
//      if (c.id === idChannel) {
//        c.color = color ? color : c.color
//        c.archivedAt = archivedAt ? archivedAt : c.archivedAt
//      }

//      return c
//    })
//  }

//  return {
//    channels,
//    multiChannels,
//    singleChannels,
//    privateChannels,
//    init,
//    getMultiChannels,
//    getSingleChannels,
//    getChannelById,
//    addNewChannel,
//    updateChannel,
//    archiveChannel
//  }
// })
