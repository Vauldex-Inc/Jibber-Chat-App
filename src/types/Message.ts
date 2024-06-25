import { z } from 'zod'

const MessageSchema = z.object({
	id: z.string(),
	channelId: z.string(),
	userId: z.string(),
	text: z.string(),
	image: z.string().optional(),
	sentAt: z.string()
})

const UnreadMessageSchema = z.object({
	messageId: z.string(),
	channelId: z.string(),
	userId: z.string(),
	unreads: z.string(),
	senderId: z.string(),
	sentAt: z.string(),
	text: z.string()
})

type Message = z.infer<typeof MessageSchema>
type UnreadMessage = z.infer<typeof UnreadMessageSchema> 

export {
	type Message,
	type UnreadMessage,
	MessageSchema,
	UnreadMessageSchema
}