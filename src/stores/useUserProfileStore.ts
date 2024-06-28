import { ref } from 'vue'
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { profileDataSchema, type Profile } from "@/types/Profile"

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

  const addUserProfile = (newProfile: Profile) => {
    profiles.value.push(newProfile)
  }

  const validateProfile = (idUser: string) => {
    const profile = profiles.value.find((p: Profile) => p.idUser === idUser)
    const validation = profileDataSchema.safeParse(profile)

    return validation.data
  }

  const getProfile = (idUser: string): Profile | undefined => {
    return profiles.value.find((p: Profile) => p.idUser === idUser)
  }

  const getImage = (idUser: string): string | undefined => {
    const data = validateProfile(idUser)
    return data ? data.image : undefined
  }

  const getName = (idUser: string): string => {
    const data = validateProfile(idUser)
    return data ? `${data.firstName} ${data.lastName}` : "Anonymous"
  }

  const getNickname = (idUser: string): string | undefined => {
    const data = validateProfile(idUser)
    return data ? data.nickName : userStore.getUser(idUser)?.username
  }

  return { profiles, init, getProfile, getImage, getName, addUserProfile, getNickname }
})
