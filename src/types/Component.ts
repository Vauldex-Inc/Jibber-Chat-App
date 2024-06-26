import { z } from 'zod'

export const SizeSchema = z.enum(["small", "medium", "large", "xlarge"])
export type Size = z.infer<typeof SizeSchema>