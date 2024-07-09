import type { User } from "@/types/User"

const userIsUser = (user: User): user is User => {
	if(typeof user.id === 'string' && typeof user.username === 'string' && typeof user.createdAt === 'string') {
		return true
	} else {
		return false
	}
}

export const useUser = () => {
	const userLocal = localStorage.getItem("user")
	if(userLocal) {
		const user = JSON.parse(userLocal)
		if(userIsUser(user)) {
			return user
		}
	}
	return undefined
}