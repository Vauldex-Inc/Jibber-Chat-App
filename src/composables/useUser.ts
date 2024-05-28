// This is not a composable!!!
import type { User } from "@/types/User"

// This is not for composables
const userIsUser = (user: User): user is User => {
	if(user && typeof user.id === 'string' && typeof user.username === 'string' && typeof user.createdAt === 'string' && typeof user.activeAt === 'string') {
		return true
	} else {
		return false
	}
}

const useUser = () => {
	const user = localStorage.getItem("user")
	if(userIsUser(user)) {
		return user
	}	else {
		return undefined
	}
}

export { useUser }
