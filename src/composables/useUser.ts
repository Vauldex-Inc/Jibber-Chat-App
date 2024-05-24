import type { User } from "@/types/User"

const userIsUser = (user: User): user is User => {
	if(user && typeof user.username === 'string' && typeof user.createdAt === 'string' && typeof user.activeAt === 'string') {
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