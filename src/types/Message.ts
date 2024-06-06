export interface Message {
	id: string,
	channelId: string,
	userId: string,
	text: string,
	image?: string,
	sentAt: string
}


export interface UnreadMessage {
	messageId: string
	channelId: string
	userId: string
	unreads: string
	senderId: string
	sentAt: string
	text: string
}