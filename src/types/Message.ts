import { z } from "zod"

const messageSchema = z.object({
	id: z.string(),
	channelId: z.string(),
	userId: z.string(),
	text: z.string(),
	image: z.string().optional(),
	sentAt: z.string()
})

type Message = z.infer<typeof messageSchema>

const unreadMessageSchema = z.object({
	messageId: z.string(),
	channelId: z.string(),
	userId: z.string(),
	unreads: z.string(),
	senderId: z.string(),
	sentAt: z.string(),
	text: z.string()
})

type UnreadMessage = z.infer<typeof unreadMessageSchema>

export { type Message, type UnreadMessage, messageSchema, unreadMessageSchema }