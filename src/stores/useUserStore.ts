import {ref} from "vue"
import {defineStore} from "pinia"
import type {User} from "@/types/User.ts"
import type {Profile} from "@/types/Profile.ts"
import {useFetch} from "@/composables/useFetch.ts"


export const useUserStore = defineStore("users", () => {
	const users = ref<[User,Profile][]>([])


	const init = async () => {
		const res = await useFetch("/users")
		const data = (await res.json()).users

		users.value = data
	}

	const getUserById = (id: string) => {
		return users.value.find(u => u[1].userId === id)
	}

	const getUsers = () => {
		return users
	}

	const getUserNameById = (id: string) => {
		const [user,profile] = getUserById(id)

		if(!profile) {
			return user.username
		}

		if(!profile.firstName && !profile.lastName) {
			return user.username
		}

		return `${profile.firstName} ${profile.lastName}`
	}

	const getUserImageById = (id: string) => {
		const profile = getUserById(id)[1]

		if(!profile) {
			return undefined
		}

		return profile.image
	}

	return {users,init,getUserById,getUsers,getUserNameById,getUserImageById}
})