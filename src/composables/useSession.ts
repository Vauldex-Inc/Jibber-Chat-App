import { UserSchema } from "@/types/User"
import axios, { AxiosError } from "axios"
import { ZodError, z } from "zod"

const UserDataSchema = z.object({
  username: z.string(),
  password: z.string()
})

type UserData = z.infer<typeof UserDataSchema>

export const useSession = () => {
  const resource = "/sessions"

  const post = async (form: UserData) => {
    try {
      const { data } = await axios.post(resource, form)
      const validation = UserSchema.safeParse(data.user)
      if (validation.success) {
        localStorage.setItem("user", JSON.stringify(validation.data))
      }
      return validation.success
    } catch (e) {
      const error = e as AxiosError | ZodError
      console.error(error.message)
    }
  }

  const destroy = async () => {
    try {
      const response = await axios.delete(resource)
      return response
    } catch (e) {
      const error = e as AxiosError
      console.error(error.message)
    }
  }

  return {
    post,
    destroy
  }
}