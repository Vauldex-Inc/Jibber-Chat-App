import {ref} from "vue"
import {defineStore} from "pinia"
import type {User} from "@/types/User.ts"
import {useFetch} from "@/composables/useFetch.ts"


export const useChannelUserStore = defineStore("channel-users", () => {
	const channelUsers = ref<[string,User[]][]>([])


	const getChannelUsers = async (channelId: string) => {
		const users = channelUsers.value.find(c => c[0] === channelId)

		if(!users) {
			const res = await useFetch(`/channels/${channelId}/users`)
			const data = (await res.json()).users

			channelUsers.value.push([channelId,data])

			return data
		} else {
			return users[1]
		}

	}

	const isMember = (channelId: string,userId: string) => {
		const users = channelUsers.value.find(c => c[0] === channelId)

		return users && users[1].find(u => u.id === userId) !== undefined
	}

	return {channelUsers,getChannelUsers,isMember}
})