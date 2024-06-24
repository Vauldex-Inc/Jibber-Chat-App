import { ref, computed } from "vue"
import { defineStore } from "pinia"
import type { ChannelUser } from "@/types/Channel"
import type { Channel } from "@/types/Channel"
import { useFetch } from "@/composables/useFetch"


export const useChannelUserStore = defineStore("channel-users", () => {
	const channelUsers = ref<[string, ChannelUser[]][]>([])
	const channelUsersCount = computed(() => {
		const copy = [...channelUsers.value]
		return copy.map(ch => {
			const [id, users] = ch
			return [id, users.length]
		})
	})


	const getChannelUsers = async (channelId: string) => {
		const users = channelUsers.value.find(c => c[0] === channelId)

		if (!users) {
			const res = await useFetch(`/channels/${channelId}/users`)
			const data = (await res.json()).users

			channelUsers.value.push([channelId, data])

			return data
		} else {
			return users[1]
		}

	}

	const addNewChannelUser = (user: ChannelUser) => {
		const chanUsers = channelUsers.value.find(c => c[0] === user.channelId)

		if (!chanUsers) {
			channelUsers.value.push([user.channelId, [user]])
		} else {
			channelUsers.value.map(ch => {
				const [id, users] = ch

				if (id === user.channelId) {
					if (!users.find(u => u.userId === user.userId)) {
						users.push(user)
					}
				}

				return [id, users]
			})
		}
	}

	const getChannelUsersCount = () => {
		return channelUsersCount;
	}

	const isMember = (channelId: string, userId: string) => {
		const users = channelUsers.value.find(c => c[0] === channelId)

		return users && users[1].find(u => u.userId === userId) !== undefined
	}

	const setChannelColor = async (channel: Channel, color: string): Promise<boolean> => {
		const res = await useFetch(`/channels/${channel.id}`, {
			method: "PUT",
			body: JSON.stringify({
				title: channel.title,
				channelType: channel.channelType,
				color: color,
			}),
		});
		return res.status === 200
	}



	return { channelUsers, getChannelUsers, isMember, addNewChannelUser, getChannelUsersCount, setChannelColor }
})