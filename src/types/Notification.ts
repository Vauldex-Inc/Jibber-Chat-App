export interface Notification {
	id: string
	title: string
	message: string
}

export interface Invitation {
	id: string
	notificationType: "INV" | "NEW"
	userId: string
	senderId: string
	channelId: string
	sentAt: string
	seenAt: string
}