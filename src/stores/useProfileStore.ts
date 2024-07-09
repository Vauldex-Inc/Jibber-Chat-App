import { computed, ref } from 'vue'
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import { useUserStore } from "@/stores/useUserStore"
import { ProfileDataSchema, type Profile, type ProfileData } from "@/types/Profile"

export const useProfileStore = defineStore("userProfile", () => {
  const profiles = ref<Profile[]>([])
  const profile = ref<Profile | undefined>()
  const userStore = useUserStore()
  const resource = "/profiles"

  const fetch = async (): Promise<void> => {
    try {
      const { data } = await axios.get("/profiles")
      const result = data.profiles
      profiles.value = result
    } catch (e) {
      const error = e as AxiosError
      console.error(error)
    }
  }

  const post = async (form: ProfileData) => {
    const response = await axios.post(resource, form)
    return response.status
  }

  const put = async (form: ProfileData) => {
    try {
      const response = await axios.put(resource, form)
      return response
    } catch (e) {
      const error = e as AxiosError
      console.error(error.message)
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

  const getName = (idUser: string): string | undefined => {
    const data = validateProfile(idUser)
    if (data?.firstName && data?.lastName) {
      return `${data?.firstName} ${data?.lastName}`
    } else if (data?.nickName) {
      return data.nickName
    } else {
      return userStore.getUser(idUser)?.username
    }
  }

  const getNickname = (idUser: string): string | undefined => {
    const data = validateProfile(idUser)
    return data ? data.nickName : userStore.getUser(idUser)!.username
  }

  return { 
    fetch, 
    getProfile, 
    getProfiles, 
    getImage, 
    getName, 
    addUserProfile, 
    getNickname, 
    updateProfile,
    post,
    put
  }
})
