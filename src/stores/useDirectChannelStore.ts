import { ref, computed } from "vue"

import { defineStore } from "pinia"
import { z, type ZodError } from "zod"
import axios, { AxiosError } from "axios"

const ChannelSchema = z.object({
  id: z.string().uuid().optional(),
  color: z.string(),
  archivedAt: z.string().datetime().nullable(),
  idUser: z.string().uuid()
})

type Channel = z.infer<typeof ChannelSchema>

const useDirectChannelStore = defineStore("direct-channels", () => {
  const _channels = ref<Array<Channel>>([])
  const resource = "/me/channels"

  const set = (list: Array<Channel>) => _channels.value = list
  const add = (channel:  Channel) => _channels.value.push(channel)

  const fetch = async () => {
    try {
      const { data } = await axios.get(resource)
      const list = data.map((d) => {
        return {
          id: d.id,
          color: d.color,
          createdAt: d.createdAt,
          archivedAt: d.archivedAt,
          idUser: d.idUser
        }
      })
      set(list)
    } catch (e) {
      const error = e as AxiosError
      console.error(error)
    }
  }

  const post = async (idUser: string) => {
    const uuid = z.string().uuid()
    try {
      uuid.parse(idUser)
      const { data } = await axios.post(resource, {
        body: { idUser }
      })

      const channel = {
        id: data.id,
        color: data.color,
        archivedAt: data.archivedAt,
        idUser: data.idUser
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

export { useDirectChannelStore }