import { z } from 'zod'

const GROUP_CHANNEL = "MPU"
const DIRECT_CHANNEL = "SNG"
const PRIVATE_CHANNEL = "MPR"

const ChannelVariantEnum = z.enum([GROUP_CHANNEL, DIRECT_CHANNEL, PRIVATE_CHANNEL])

const ChannelSchema = z.object({
	id: z.string(),
	idUser: z.string(),
	title: z.string(),
	channelType: ChannelVariantEnum.optional(),
	color: z.string().optional(),
	createdAt: z.string().datetime(),
	archivedAt: z.string().datetime().optional()
})

const ChannelUserSchema = z.object({
	idChannel: z.string(),
	idUser: z.string()
})

const DirectChannelSchema = z.object({
	id: z.string().uuid(),
	color: z.string().optional(),
	archivedAt: z.string().datetime().optional(),
	idUser: z.string().uuid(),
	idReceiver: z.string().uuid()
})

const ChannelDataSchema = z.object({
  title: z.string(),
  channelType: ChannelVariantEnum,
  archivedAt: z.string().optional(),
  color: z.string().optional()
})

type ChannelVariant = z.infer<typeof ChannelVariantEnum>

type Channel = z.infer<typeof ChannelSchema>
type ChannelUser = z.infer<typeof ChannelUserSchema>
type DirectChannel = z.infer<typeof DirectChannelSchema>
type ChannelData = z.infer<typeof ChannelDataSchema>

export {
	type Channel,
	type ChannelUser,
	type DirectChannel,
	type ChannelData,
	type ChannelVariant,
	ChannelVariantEnum,
	ChannelDataSchema,
	ChannelSchema,
	ChannelUserSchema,
	DirectChannelSchema,
	GROUP_CHANNEL,
	DIRECT_CHANNEL
}