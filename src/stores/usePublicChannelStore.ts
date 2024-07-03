import { ref, computed } from "vue"
import { ZodError, z } from "zod"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { 
  ChannelSchema, 
  ChannelVariantEnum, 
  type ChannelData, 
  type ChannelVariant
} from "@/types/Channel"

const PublicChannelSchema = z.object({
  id: z.string(),
  idUser: z.string(),
  title: z.string(),
  color: z.string().optional(),
  channelType: ChannelVariantEnum.optional(),
  createdAt: z.string().datetime(),
  archivedAt: z.string().datetime().optional()
})

type PublicChannel = z.infer<typeof PublicChannelSchema>

export const usePublicChannelStore = defineStore("public-channels", () => {
  const _channels = ref<Array<PublicChannel>>([])
  const variant = ref<ChannelVariant | undefined>(undefined)

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
      const list = data.map((d: unknown) => PublicChannelSchema.parse(d))
      set(list)
    } catch (e) {
      const error = e as AxiosError | ZodError
      console.error(error)
    }
  }

  const post = async (channel: ChannelData) => {
    try {
      const { data } = await axios.post(resource, channel)
      const responseValidation = ChannelSchema.safeParse(data.channel)
      if (responseValidation.success) {
        const response = await axios.post(`${resource}/${data.channel.id}/users`, {})

        if (response.status === 200) {
          add(responseValidation.data)
        } else {
          throw new Error("Failed to create channel")
        }
      } else {
        throw new Error("Uknown Format")
      }
    } catch (error) {
      error instanceof Error ? console.error(error.message) : console.error("An error ocurred.")
    }
  }

  const getChannelById = (idChannel: string) => {
		return _channels.value.find(c => c.id === idChannel)
	}

  const channels = computed(() => _channels)

  const updateChannelColor = (idChannel: string, color?: string, archivedAt?: string) => {
		_channels.value.map(c => {
			if (c.id === idChannel) {
				c.color = color ? color : c.color
				c.archivedAt = archivedAt ? archivedAt : c.archivedAt
			}
		})
	}

  return {
    channels,
    fetch,
    post,
    getTitle,
    add,
    variant,
    getChannelById,
    updateChannelColor
  }
})