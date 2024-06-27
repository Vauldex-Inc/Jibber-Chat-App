import { ref, computed } from "vue"

import { ZodError, z } from "zod"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"

const ChannelSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  color: z.string(),
  archivedAt: z.string().datetime().nullable()
})

type Channel = z.infer<typeof ChannelSchema>

const usePublicChannelStore = defineStore("public-channels", () => {
  const _channels = ref<Array<Channel>>([])
  const resource = "/channels"

  const add = (channel: Channel) => _channels.value.push(channel)
  const set = (list: Array<Channel>) => _channels.value = list

  const fetch = async () => {
    try {
      const { data } = await axios.get(resource)
      const list = data.map((d) => {
        return {
          id: d.id,
          title: d.title,
          color: d.color,
          createdAt: d.createdAt,
          archivedAt: d.archivedAt
        }
      })
      set(list)
    } catch (e) {
      const error = e as AxiosError
      console.error(error)
    }
  }

  const post = async (idReceiver: string) => {
    const uuid = z.string().uuid()
    try {
      uuid.parse(idReceiver)
      const { data } = await axios.post(resource, {
        body: { idReceiver }
      })

      const channel = {
        id: data.id,
        title: data.title,
        color: data.color,
        archivedAt: data.archivedAt
      }
      add(channel)
    } catch (e) {
      const error = e as AxiosError | ZodError
      console.error(error)
    }
  }

  const channels = computed(() => _channels) 

  return {
    channels,
    fetch,
    post
  }
})

export { usePublicChannelStore }