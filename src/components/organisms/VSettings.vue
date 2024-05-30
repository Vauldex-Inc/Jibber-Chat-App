<template>
	<div class="relative">
		<VIconButton class="bg-gray-100 dark:bg-slate-900" :invert="true" icon="./src/assets/images/settings.svg" @click="toggleSettings" :rounded="true"/>
		<ul class="absolute w-[220px] bottom-0 left-0 translate-y-full  flex flex-col bg-white shadow-xl z-30 rounded-md dark:bg-slate-800" v-if="isOpen">
			<li class="hover:bg-gray-100 dark:hover:bg-slate-700 hover:rounded-md" @click="toggleSettings">
					<VThemeSelector />
			</li>
			<li class="hover:bg-gray-100 dark:hover:bg-slate-700 hover:rounded-md" @click="toggleSettings">
				<VButton class="flex items-center w-full gap-3"  @click="logout">
					<img class="h-7 aspect-square" src="@/assets/images/logout.svg" />
					<span>Logout</span>
				</VButton>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useFetch } from "@/composables/useFetch"

import VIconButton from "@/components/atoms/VIconButton.vue"
import VButton from "@/components/atoms/VButton.vue"
import VThemeSelector from "@/components/organisms/VThemeSelector.vue"

const router = useRouter()
const isOpen = ref<boolean>(false)

const toggleSettings = () => isOpen.value = !isOpen.value
	
const logout = async () => {
	try {
		const response = await useFetch("/sessions", {method: "DELETE"})
		if(response.status === 200) {
			localStorage.removeItem("user")
			router.push("/")
		} 
	} catch (err) {
		throw new Error(err)
	} 
}

</script>