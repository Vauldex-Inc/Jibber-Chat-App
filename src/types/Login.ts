import { z } from 'zod'

const FormDataSchema = z.object({
  username: z.string({
    required_error: 'Username is required'
  }).min(8, {
    message: 'Username is required'
  }),
  password: z.string({
    required_error: 'Username is required'
  }).min(8, {
    message: 'Username is required'
  })
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

