<template>
	<div class="bg-white shadow-md p-4 rounded-md w-[420px] dark:bg-slate-900">
		<header>
			<h4 class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Direct message</h4>
			<hr class="my-5 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"/>
		</header>
		<form @submit.prevent class="relative">
			<VInput class="w-full rounded-md border-2 border-indigo-300 focus:border-indigo-600 hover:border-indigo-600
						dark:bg-slate-900 dark:border-slate-800 dark:focus:border-indigo-600 dark:hover:border-indigo-600 dark:placeholder:text-gray-600" v-model="inputUserName" type="text" placeholder="Enter name..." size="md" />
			<VInput type="submit" hidden />
		</form>
		<div class="absolute top-40 shadow-md left-0 bg-white w-full rounded-md px-2 py-5 hover:border-indigo-600
						dark:bg-slate-900 dark:border-slate-800 dark:focus:border-indigo-600 dark:hover:border-indigo-600">
			<ul class="max-h-56 overflow-y-scroll flex flex-col gap-2">
				<template v-if="filteredUserName.length > 0">
					<li v-for="[id, name] in filteredUserName" :key="id"  class="flex justify-between items-center hover:bg-gray-100 hover:dark:bg-gray-800 rounded-md px-4 py-2">
						<span>
							{{ name }}
						</span>
						<p v-if="checkInviteStatus(id)"  class="dark:bg-slate-700 dark:text-gray-400 bg-slate-300 text-gray-700 py-2 px-3 text-sm rounded-md">
							Messaged
						</p>
						<VButton v-else @click="create(id, name)" size="sm" :class="color" class="cursor-pointer text-gray-100 rounded-md">
							Message
						</VButton>
					</li>
				</template>
				<p v-else class="text-sm text-center">
					Nothing matched.
				</p>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useFetch } from "@/composables/useFetch.ts"
import { useUserStore } from "@/stores/useUserStore"
import type { User } from "@/types/User"
import type { Profile } from "@/types/Profile"
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"

const props = defineProps<{
	color: string
}>()

const emits = defineEmits<{
	submit: [channel: Channel | undefined]
}>()

const userStore = useUserStore()
const users = userStore.getUsers()

const inputUserName = ref<string>('')
const invitedUsers = ref<string[]>([])

const checkInviteStatus = (userId: string) => invitedUsers.value.includes(userId)

const filteredUserName = computed(() => {
	return users.value.filter((userProfile: [User, Profile]) => {
		const [user, profile] = userProfile
		const currentName = inputUserName.value.toLowerCase()
		return (userStore.getUserNameById(user.id).toLowerCase().includes(currentName))
	}).map((userProfile: [User, Profile]) => {
		const [user, profile] = userProfile
		return [user.id, userStore.getUserNameById(user.id)]
	})
})

const create = async (userId: string, name: string) => {
	try {
		const response = await useFetch("/channels", {
			method: "POST",
			body: JSON.stringify({
				title: name,
				channelType: "SNG"
			})
		})

		if(response.status === 200) {
			const result = await response.json()

			const channel = result.channel

			const res = await useFetch(`/channels/${channel.id}/users`, {
				method: "POST",
				body: JSON.stringify({userId})
			})
			
			invitedUsers.value.push(userId)
			emits('submit', channel)
		}
	} catch (err) {
		emits('submit', undefined)
		throw new Error(err)
	}
}

</script>