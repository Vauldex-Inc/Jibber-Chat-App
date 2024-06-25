import { z } from "zod"

const notificationSchema = z.object({
	id: z.string(),
	title: z.string(),
	message: z.string(),
})

type Notification = z.infer<typeof notificationSchema>

const invitationSchema = z.object({
	id: z.string(),
	notification: z.enum(["INV", "NEW"]),
	userId: z.string(),
	senderId: z.string(),
	channelId: z.string(),
	sentAt: z.string(),
	seenAt: z.string()
})

type Invitation = z.infer<typeof invitationSchema>

export { type Notification, type Invitation, notificationSchema, invitationSchema }