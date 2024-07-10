import { z } from 'zod'

const MessageSchema = z.object({
	id: z.string(),
	idChannel: z.string(),
	idUser: z.string(),
	text: z.string(),
	image: z.string().optional(),
	sentAt: z.string().datetime()
})

const UnreadMessageSchema = z.object({
	idMessage: z.string(),
	idChannel: z.string().uuid(),
	idUser: z.string().uuid(),
	unreads: z.string(),
	idSender: z.string().uuid(),
	sentAt: z.string().datetime(),
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