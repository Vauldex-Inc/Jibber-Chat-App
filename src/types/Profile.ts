import { z } from "zod"

const ProfileSchema = z.object({
	idUser: z.string(),
	nickName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	image: z.string().optional(),
	email: z.string().optional()
})

const ProfileDataSchema = z.object({
	nickName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	image: z.string().optional(),
	email: z.string().optional()
})

type Profile = z.infer<typeof ProfileSchema>
type ProfileData = z.infer<typeof ProfileDataSchema>

export { 
	type Profile, 
	type ProfileData, 
	ProfileSchema, 
	ProfileDataSchema
}