import { z } from 'zod'

const SizeSchema = z.enum(["small", "medium", "large", "extraLarge"])

type Size = z.infer<typeof SizeSchema>

export { type Size, SizeSchema }