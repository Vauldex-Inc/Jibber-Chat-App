<template>
	<div class="relative">
		<VIconButton size="lg" :invert="true" icon="./src/assets/images/settings.svg" @click="toggleSettings" :rounded="true"/>
		<ul class="absolute w-[180px] bottom-0 left-0 translate-y-full  flex flex-col bg-white shadow-xl z-30 rounded-md dark:bg-slate-800" v-if="isOpen">
			<li class="hover:bg-gray-100 dark:hover:bg-slate-700 hover:rounded-md">
					<VThemeSelector />
			</li>
			<li class="hover:bg-gray-100 dark:hover:bg-slate-700 hover:rounded-md">
				<VButton class="flex items-center w-full gap-3"  @click="logout">
					<img class="h-8 aspect-square" src="@/assets/images/logout.svg" />
					<span>Logout</span>
				</VButton>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import VButton from "@/components/atoms/VButton.vue"
import VThemeSelector from "@/components/organisms/VThemeSelector.vue"

const isOpen = ref<boolean>(true)

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