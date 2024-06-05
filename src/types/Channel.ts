export interface Channel {
	id: string;
	userId: string;
	title: string;
	channelType: string;
	color?: string;
	createdAt: string;
	archivedAt?: string;
}

export interface ChannelUser {
	channelId: string;
	userId: string
}