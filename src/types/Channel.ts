import { z } from 'zod'

const ChannelSchema = z.object({
	id: z.string(),
	idUser: z.string(),
	title: z.string(),
	channelType: z.string().optional(),
	color: z.string().optional(),
	createdAt: z.string(),
	archivedAt: z.string().optional()
})

const ChannelUserSchema = z.object({
	idChannel: z.string(),
	idUser: z.string()
})

const DirectChannelSchema = z.object({
	id: z.string().uuid(),
	color: z.string().optional(),
	archivedAt: z.string().datetime().optional(),
	idUser: z.string().uuid()
})

type Channel = z.infer<typeof ChannelSchema>
type ChannelUser = z.infer<typeof ChannelUserSchema>
type DirectChannel = z.infer<typeof DirectChannelSchema>

export {
	type Channel,
	type ChannelUser,
	type DirectChannel,
	ChannelSchema,
	ChannelUserSchema,
	DirectChannelSchema
}