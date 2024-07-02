import { z } from "zod";

const UserSchema = z.object({
	id: z.string(),
	username: z.string(),
	createdAt: z.string(),
	activeAt: z.string()
})

type User = z.infer<typeof UserSchema>

export { type User, UserSchema }
