// userId ? how about idUser. Mikee, Kevin and Albert will be happy

export interface Channel {
	id: string;
	userId: string;
	title: string;
	type: string;
	color: string;
	createdAt: string;
	archivedAt?: string;
}
