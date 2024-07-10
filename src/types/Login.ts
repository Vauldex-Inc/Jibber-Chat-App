import { z } from 'zod'

const FormDataSchema = z.object({
  username: z.string().min(8).max(20),
  password: z.string().min(8).max(20)
})

const PasswordTypeEnum = z.enum(["text", "password"])


type PasswordType = z.infer<typeof PasswordTypeEnum>
type LoginForm = z.infer<typeof FormDataSchema>

const baseForm: LoginForm = {
  username: "",
  password: ""
}

export {
  type PasswordType,
  type LoginForm,
  FormDataSchema,
  PasswordTypeEnum,
  baseForm
}

