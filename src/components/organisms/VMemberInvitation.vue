<template>
	<div class="bg-white shadow-md p-4 rounded-md w-[420px] dark:bg-slate-900">
		<header>
			<h4 class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Invite member</h4>
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
					<li v-for="[id, name] in filteredUserName" :key="id"  class="flex justify-between items-center hover:bg-gray-100 hover:dark:bg-slate-800/50 rounded-md px-4 py-2">
						<span>
							{{ name }}
						</span>
						<p v-if="checkInviteStatus(id)"  class="dark:bg-slate-700 dark:text-gray-400 bg-slate-300 text-gray-700 py-2 px-3 text-sm rounded-md">
							Invited
						</p>
						<VButton v-else @click="selectedUserName(id)" size="sm" :class="color" class="cursor-pointer text-gray-100 rounded-md">
							Invite
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
import { useUserStore } from "@/stores/useUserStore"

import type { User } from "@/types/User"
import type { Profile } from "@/types/Profile"

import {useChannelUserStore} from "@/stores/useChannelUserStore"

import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"


const userStore = useUserStore()
const channelUserStore = useChannelUserStore()
const users = computed(() => {
	const appUsers= userStore.getUsers()
	return appUsers.value.filter(cu => !channelUserStore.isMember(props.channelId,cu[0].id))
})

const invitedUsers = ref<string[]>([])
const checkInviteStatus = (userId) => invitedUsers.value.includes(userId)

const selectedUserName = (userId) => {
	invitedUsers.value.push(userId)
	emits('action', userId)
}

const inputUserName = ref<string>('')

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

const props = defineProps<{
	color: string
	channelId: string
}>()

const emits = defineEmits<{
	action: [value: string]
}>()

</script>