import { z } from "zod"

const NotificationSchema = z.object({
	id: z.string(),
	title: z.string(),
	message: z.string(),
})

const InvitationSchema = z.object({
	id: z.string(),
	notificationType: z.enum(["INV", "NEW"]),
	idUser: z.string(),
	idSender: z.string(),
	idChannel: z.string(),
	sentAt: z.string(),
	seenAt: z.string().optional()
})

type Notification = z.infer<typeof NotificationSchema>
type Invitation = z.infer<typeof InvitationSchema>

export {
	type Notification,
	type Invitation,
	NotificationSchema,
	InvitationSchema
}