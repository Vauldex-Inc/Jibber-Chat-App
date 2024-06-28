import { z } from 'zod'

const ChannelSchema = z.object({
	id: z.string(),
	idUser: z.string(),
	title: z.string(),
	channelType: z.string(),
	color: z.string().optional(),
	createdAt: z.string(),
	archivedAt: z.string().optional() 
})

const ChannelUserSchema = z.object({
	idChannel: z.string(),
	idUser: z.string()
})

type Channel = z.infer<typeof ChannelSchema>
type ChannelUser = z.infer<typeof ChannelUserSchema>

export { 
	type Channel,
	type ChannelUser,
	ChannelSchema,
	ChannelUserSchema
}