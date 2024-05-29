export interface Message {
	id: string,
	channelId: string,
	userId: string,
	text: string,
	image?: string,
	sentAt: string
}