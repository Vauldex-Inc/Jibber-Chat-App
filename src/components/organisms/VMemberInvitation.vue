<template>
	<div class="bg-white shadow-md p-4 rounded-md w-[420px] dark:bg-slate-900">
		<header>
			<h4 class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Invite member</h4>
			<hr class="my-5 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"/>
		</header>
		<form @submit.prevent="addMember" class="relative">
			<VInput class="w-full rounded-md border-2 border-indigo-300 focus:border-indigo-600 hover:border-indigo-600
						dark:bg-slate-900 dark:border-slate-800 dark:focus:border-indigo-600 dark:hover:border-indigo-600 dark:placeholder:text-gray-600" v-model="inputUserName" type="text" placeholder="Enter name..." size="md" />
			<VInput type="submit" hidden />
		</form>
		<div class="absolute top-40 shadow-md left-0 bg-white w-full rounded-md px-2 py-5 hover:border-indigo-600
						dark:bg-slate-900 dark:border-slate-800 dark:focus:border-indigo-600 dark:hover:border-indigo-600">
			<ul class="max-h-56 overflow-y-scroll flex flex-col gap-2">
				<template v-if="filteredUserName.length >0">
					<li v-for="[id, name] in filteredUserName" :key="id" @click="selectedUserName(id, name)" class="hover:bg-gray-100 hover:dark:bg-gray-800 rounded-md px-4 py-2 cursor-pointer">
						{{ name }}
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
import VInput from "@/components/atoms/VInput.vue"

import { useUserStore } from "@/stores/useUserStore"

import type { User } from "@/types/User"
import type { Profile } from "@/types/Profile"

const userStore = useUserStore()
const users = userStore.getUsers()

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


const selectedUserName = (id, name) => {
	inputUserName.value = name 
	emits('action', id)
}

const addMember = () => {
	if(filteredUserName.value.length > 0) {
		const [id, name] = filteredUserName.value[0]
		selectedUserName(id, name)
	}
}

const emits = defineEmits<{
	action: [value: string]
}>()


</script>