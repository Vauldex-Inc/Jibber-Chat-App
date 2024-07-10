import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { ZodError, z } from "zod"
import { UserSchema } from "@/types/User"

const UserDataSchema = z.object({
  username: z.string(),
  password: z.string()
})

type User = z.infer<typeof UserDataSchema>

export const useAuthStore = defineStore("auth-store", () => {
  const resource = "/sessions"

  const post = async (form: User) => {
    const { data } = await axios.post(resource, form)
    const validation = UserSchema.safeParse(data.user)

    if (validation.success) {
      localStorage.setItem("user", JSON.stringify(validation.data))
    }

    return validation.success
  }

  const destroy = async () => {
    const response = await axios.delete(resource)
    return response.status
  }

  return {
    post,
    destroy
  }
})