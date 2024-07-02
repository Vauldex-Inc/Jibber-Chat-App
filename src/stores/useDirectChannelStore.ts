import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { z, type ZodError } from "zod"
import axios, { AxiosError } from "axios"
import { type DirectChannel, DirectChannelSchema } from "@/types/Channel"

const CHANNEL_TYPE = "SNG" as const

const useDirectChannelStore = defineStore("direct-channels", () => {
  const _channels = ref<Array<DirectChannel>>([])

  const set = (list: Array<DirectChannel>) => _channels.value = list
  const add = (channel: DirectChannel) => _channels.value.push(channel)

  const fetch = async () => {
    try {
      const { data } = await axios.get("/me/channels")
      const list: Array<DirectChannel> = data.channels.map((d: DirectChannel) => DirectChannelSchema.parse(d))
      set(list)
    } catch (e) {
      const error = e as AxiosError
      console.error(error.message)
    }
  }

  const post = async (idUser: string) => {
    const uuid = z.string().uuid()
    try {
      uuid.parse(idUser)
      const response = await axios.post("/channels", {
        channelType: CHANNEL_TYPE,
        idUser
      })

      const { data } = response
      const channel = DirectChannelSchema.parse(data.channel)

      add(channel)

      if (response.status === 200) {
        const response = await axios.post(`/channels/${channel.id}/users`, {idUser})
        return response.status
      } else {
        throw new Error("Internal Server Error")
      }
    } catch (e) {
      const error = e as AxiosError | ZodError
      console.error(error)
    }
  }
  const channels = computed(() => _channels)
  const getDirectChannel = (idChannel: string) => {
    return _channels.value.find((c: DirectChannel) => c.id === idChannel)
  }

  return {
    channels,
    fetch,
    post,
    add,
    getDirectChannel
  }
})

export { useDirectChannelStore }