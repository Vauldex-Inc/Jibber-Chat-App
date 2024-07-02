import { ref, computed } from "vue"
import { ZodError, z } from "zod"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"

const PublicChannelSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  color: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional()
})

type PublicChannel = z.infer<typeof PublicChannelSchema>

export const usePublicChannelStore = defineStore("public-channels", () => {
  const _channels = ref<Array<PublicChannel>>([])
  const resource = "/channels"

  const add = (channel: PublicChannel) => _channels.value.push(channel)
  const set = (list: Array<PublicChannel>) => _channels.value = list

  const getTitle = (idChannel: string): string => {
    const found = _channels.value.find((c: PublicChannel) => c.id === idChannel)
    return found ? found.title : "Anonymous"
  }

  const fetch = async () => {
    try {
      const { data } = await axios.get(resource)
      const list = data.map((d: PublicChannel) => {
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
    post,
    getTitle,
    add
  }
})