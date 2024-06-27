import { z } from 'zod'

export const SizeSchema = z.enum(["small", "medium", "large", "extraLarge"])
export type Size = z.infer<typeof SizeSchema>