import { z } from 'zod'

const MessageSchema = z.object({
	id: z.string(),
	idChannel: z.string(),
	idUser: z.string(),
	text: z.string(),
	image: z.string().optional(),
	sentAt: z.string()
})

const UnreadMessageSchema = z.object({
	idMessage: z.string(),
	idChannel: z.string(),
	idUser: z.string(),
	unreads: z.string(),
	idSender: z.string(),
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