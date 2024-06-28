import { ref } from 'vue'
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import type { Profile } from "@/types/Profile"

export const useUserProfileStore = defineStore("userProfile", () => {
  const profiles = ref<Profile[]>([])

  const init = async (): Promise<void> => {
    try {
      const { data } = await axios.get("/profiles")
      const result = data.profiles
      profiles.value = result
    } catch (e) {
      const error = e as AxiosError
      console.error(error)
    }
  }

  const getProfile = (idUser: string): Profile | undefined => {
    return profiles.value.find((profile) => {
      return profile.idUser === idUser
    })
  }

  const getImageUser = (idUser: string): string | undefined => {
    const userProfile = profiles.value.find((profile) => {
      return profile.idUser === idUser
    })

    return (userProfile && userProfile.image) ? userProfile.image : undefined
  }

  return { profiles, init, getProfile, getImageUser }
})
