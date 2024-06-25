import { z } from "zod"

const profileSchema = z.object({
	userId: z.string(),
	nickName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	image: z.string().optional(),
	email: z.string().optional()
})

type Profile = z.infer<typeof profileSchema>

const profileDataSchema = z.object({
	nickName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	image: z.string().optional(),
	email: z.string().optional()
})

type ProfileData = z.infer<typeof profileDataSchema>

export { type Profile, type ProfileData, profileSchema, profileDataSchema }