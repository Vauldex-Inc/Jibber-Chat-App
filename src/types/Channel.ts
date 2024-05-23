export interface Channel {
	id: string;
	userId: string;
	title: string;
	type: string;
	color: string;
	createdAt: string;
	archivedAt?: string;
}