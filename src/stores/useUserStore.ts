import {ref} from "vue"
import {defineStore} from "pinia"
import type {User} from "@/types/User.ts"
import type {Profile} from "@/types/Profile.ts"
import {useFetch} from "@/composables/useFetch.ts"


export const useUserStore = defineStore("users", () => {
	const users = ref<[User,Profile][]>([])

	const onlineUsers = ref<string[]>([])


	const init = async () => {
		const res = await useFetch("/users")
		const data = (await res.json()).users

		users.value = data
	}

	const getUserById = (id: string) => {
		return users.value.find(u => u[0].id === id)
	}

	const getUsers = () => {
		return users
	}

	const getUserNameById = (id: string) => {
		const userProfile = getUserById(id)

		if(!userProfile) {
			return "Anonymous"
		}

		const [user,profile] = userProfile

		if(!profile) {
			return user.username
		}

		if(!profile.firstName && !profile.lastName) {
			return user.username
		}


		if(profile.firstName.trim() === "" || profile.lastName.trim() === "") {
			return user.username
		}

		return `${profile.firstName} ${profile.lastName}`
	}

	const getUserImageById = (id: string) => {
		const userProfile = getUserById(id)

		if(!userProfile) {
			return undefined
		}

		const [user,profile] = userProfile
		
		if(!profile) {
			return undefined
		}

		return profile.image
	}

	const addUserProfile = (id: string, newProfile: Profile) => {
		users.value = [...users.value.map(u => {
				const [user, profile] = u
				if(user.id === id) {
					return [user,newProfile]
				}
				return [user, profile]
		})]
	}

	const updateUserOnlineAt = (users: User[], type: string) => {
		if(type === "online") {
			onlineUsers.value = users
		} else {
			onlineUsers.value = [...onlineUsers.value.filter(ol => users.indexOf(ol) === -1 )]
		}
	}

	const getOnlineUsers = () => {
		return onlineUsers
	}

	const addNewUser = (user: User) => {
		users.value.push([user,undefined])
	}

	return {users,init,getUserById,getUsers,getUserNameById,
	getUserImageById,addUserProfile,updateUserOnlineAt,onlineUsers,getOnlineUsers, addNewUser}
})