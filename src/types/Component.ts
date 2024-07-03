import { z } from 'zod'

export const SizeSchema = z.enum(["extraSmall", "small", "medium", "large", "extraLarge"])
export type Size = z.infer<typeof SizeSchema>