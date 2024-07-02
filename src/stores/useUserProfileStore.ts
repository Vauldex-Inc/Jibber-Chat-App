import { computed, ref } from 'vue'
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { useUserStore } from "@/stores/useUserStore"
import { ProfileDataSchema, type Profile } from "@/types/Profile"


export const useUserProfileStore = defineStore("userProfile", () => {
  const profiles = ref<Profile[]>([])
  const profile = ref<Profile | undefined>()

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

  const getProfiles = computed(() => {
    return profiles
  })

  const validateProfile = (idUser: string) => {
    const profile = profiles.value.find((p: Profile) => p.idUser === idUser)
    const validation = ProfileDataSchema.safeParse(profile)

    return validation.data
  }

  const getProfile = (idUser: string) => {
    profile.value = profiles.value.find((p: Profile) => p.idUser === idUser)
    return profile
  }

  const updateProfile = (profile: Profile) => {
    profiles.value = profiles.value.map((p) => {
      if (p.idUser === profile.idUser) {
        return profile
      }
      return p
    })
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
    const userStore = useUserStore()
    const data = validateProfile(idUser)
    return data ? data.nickName : userStore.getUser(idUser)?.username
  }

  return { 
    init, 
    getProfile, 
    getProfiles, 
    getImage, 
    getName, 
    addUserProfile, 
    getNickname, 
    updateProfile
  }
})
