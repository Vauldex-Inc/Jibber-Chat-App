import { z } from "zod";

const UserSchema = z.object({
	id: z.string(),
	username: z.string(),
	createdAt: z.string(),
	activeAt: z.string().optional()
})

const StatusSchema = z.enum(['online', 'offline'])

type User = z.infer<typeof UserSchema>
type Status = z.infer<typeof StatusSchema>

export { 
	type User,
	type Status,
	UserSchema,
	StatusSchema
}
