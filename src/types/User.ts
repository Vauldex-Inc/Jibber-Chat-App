import { z } from "zod";

const userSchema = z.object({
	id: z.string(),
	username: z.string(),
	createdAt: z.string(),
	activeAt: z.string()
})

type User = z.infer<typeof userSchema>

export { type User, userSchema }