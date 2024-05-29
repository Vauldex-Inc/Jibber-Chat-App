<template>
	<div class="flex items-center justify-start gap-5 p-5 border-b border-b-indigo-200
			 dark:border-b-slate-800 dark:shadow-none">
		<VAvatar v-if="channel.channelType === 'SNG'" :image="senderProfile"/>
		<div 
				v-else
				class="h-12 aspect-square flex items-center justify-center rounded-full text-white"
				:class="color"
				>
				<p>{{channelAbbr}}</p>
		</div>
		<div>
			<div>
				<p v-if="channel.channelType === 'SNG'" class="text-gray-700 dark:text-gray-300 font-semibold">{{senderName}}</p>
				<p v-else class="text-gray-700 dark:text-gray-300 font-semibold">{{channel.title}}</p>
				<p>{{count}} members</p>
			</div>
		</div>
		<VIconButton 
				class="bg-indigo-600 ml-auto"
				icon="./src/assets/images/archive.svg"/>
	</div>
</template>

<script lang="ts" setup>
import VAvatar from "@/components/atoms/VAvatar.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import type {Channel} from "@/types/Channel.ts"
import type {User} from "@/types/User.ts"
import {useUserStore} from "@/stores/useUserStore.ts"
import {computed,ref} from "vue"
import {useFetch} from "@/composables/useFetch.ts"

const userStore = useUserStore()

const senderName = computed(() => {
	if(!props.sender) return ""
	return userStore.getUserNameById(props.sender)
})

const senderProfile = computed(() => {
	if(!props.sender) return undefined
	return userStore.getUserImageById(props.sender)
})

const channelAbbr = computed(() => {
	return props.channel.title.slice(0,1)
})

const color = computed(() => {
	return props.channel.color? props.channel.color.trim() : 'bg-gray-500 dark:bg-slate-800'
})


const props = defineProps<{
	channel: Channel
	sender?: string
	count?: number
}>()


</script>