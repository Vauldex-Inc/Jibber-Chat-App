<template>
	<div class="bg-white py-5 shadow-md rounded-md w-[420px] dark:bg-slate-900">
		<header class="px-5">
			<h4 class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Members</h4>
			<hr class="my-3 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"/>
		</header>
		<ul class="max-h-96 px-5 overflow-y-scroll scroll-auto flex flex-col gap-4">
			<li v-for="[user, profile] in users" class="flex justify-between items-center hover:bg-gray-100 hover:dark:bg-gray-800 rounded-md px-4 py-2">
				<div class="flex gap-4">
 					<template v-if="profile">
						<VAvatar :image="profile.image" :status="getStatus(user.id)" />
						<div class="flex flex-col">
							<span class="font-semibold">{{ `${profile.firstName} ${profile.lastName}` }}</span>
							<span v-if="profile.nickName" class="text-xs">({{ profile.nickName }})</span>
						</div>
					</template>
					<template v-else>
							<VAvatar />
						<div class="flex flex-col">
							<span>{{ user.username }}</span>
						</div>
					</template>
				</div>
			</li> 
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useChannelUserStore } from "@/stores/useChannelUserStore.ts"
import { useUserStore } from "@/stores/useUserStore.ts"
import VAvatar from "@/components/atoms/VAvatar.vue"

import { type User } from "@/types/User"
import { type Profile } from "@/types/Profile"

const userStore = useUserStore()

const channelUserStore = useChannelUserStore()
const props = defineProps<{
	channelId: string
}>()

const getStatus = (id: string) => {
	return userStore.getOnlineUsers().value.indexOf(id) !== -1 ? 'online' : 'offline'
}

const channelUsers = ref([])
const users = ref<[User, Profile][]>([])

onMounted(async () => {
	channelUsers.value = await channelUserStore.getChannelUsers(props.channelId)
	users.value = channelUsers.value.map((channelUser) => {
		return userStore.getUserById(channelUser.userId)
	})
})



</script>