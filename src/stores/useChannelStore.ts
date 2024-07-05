import { ref, computed } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { z, type ZodError } from "zod"
import { type Channel, type DirectChannel, type ChannelVariant, PublicChannelSchema } from "@/types/Channel"
import { useUserProfileStore } from "./useUserProfileStore"

type ChannelType = Channel | DirectChannel

export const useChannelStore = defineStore("channels", () => {
  // makes the state private
  const _channel = ref<ChannelType>({} as ChannelType)
  const profileStore = useUserProfileStore()
  const uuid = z.string().uuid()

  const channel = computed(() => _channel.value)

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
        color,
      })

      return response.status
    } catch (e) {
      const error = e as AxiosError | ZodError
      console.error(error.message)
    }
  }
  
  const archiveChannel = async (channel: Channel | DirectChannel, archivedAt: string) => {
    const validation = PublicChannelSchema.safeParse(channel)
    try {
      const title = validation.success ? validation.data.title : profileStore.getName(channel.idUser)
      const channelType = validation.success ? "MPU" : "SNG"
 
      await axios.put(`/channels/${channel.id}`, {
        title: title,
        channelType: channelType,
        color: undefined,
        archivedAt: archivedAt,
      })
    } catch (e) {
      const error = e as ZodError | AxiosError
      console.error(error)
    }
  }

  return {
    channel,
    set,
    changeTheme,
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
