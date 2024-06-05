<template>
	<div class="flex items-center justify-start gap-5 p-5 border-b border-b-indigo-200
			 dark:border-b-slate-800 dark:shadow-none">
		<VAvatar v-if="channel.channelType === 'SNG'" :image="senderProfile" :status="senderStatus"/>
		<div 
				v-else
				class="h-12 aspect-square flex items-center justify-center rounded-full text-white"
				:class="curColorTheme"
				>
				<p>{{channelAbbr}}</p>
		</div>
		<div>
			<div>
				<template v-if="channel.channelType === 'SNG'">
					<p class="text-gray-700 dark:text-gray-300 font-semibold">{{senderName}}</p>
					<p class="text-sm capitalize" :class="{'text-emerald-600': senderStatus === 'online'}">{{senderStatus}}</p>
				</template>
				<template v-else>
					<p class="text-gray-700 dark:text-gray-300 font-semibold">{{channel.title}}</p>
					<p class="text-sm">{{count && count > 1 ? `${count} members` : `${count} member`}}</p>
				</template>
			</div>
		</div>
		<VIconButton 
				@click="achiveChannel"
				v-if="(sender && channel.userId === sender) && !channel.archivedAt"
				class="ml-auto"
				:class="curColorTheme"
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
import {useChannelUserStore} from "@/stores/useChannelUserStore"


const userStore = useUserStore()
const channelUserStore = useChannelUserStore()
const channelUsersCount = channelUserStore.getChannelUsersCount()

const count = computed(() => {
	const userCount = channelUsersCount.value.find(ch => ch[0] === props.channel.id)

	return userCount ? userCount[1] : 0
})

const senderName = computed(() => {
	if(!props.sender) return ""
	return userStore.getUserNameById(props.sender)
})

const senderProfile = computed(() => {
	if(!props.sender) return undefined
	return userStore.getUserImageById(props.sender)
})

const senderStatus = computed(() => {
	if(!props.sender) return undefined
	return userStore.getOnlineUsers().value.indexOf(props.sender) !== -1 ? 'online' : 'offline'
})

const channelAbbr = computed(() => {
	return props.channel.title.slice(0,1)
})

const curColorTheme = computed(() => {
	return props.channel.color ? props.channel.color : "bg-slate-800"
})


const achiveChannel = async () => {
	const archivedAt = new Date().toISOString()

	const res = await useFetch(`/channels/${props.channel.id}`, {
		method: "PUT",
		body: JSON.stringify({
	    title: props.channel.title,
	    channelType: props.channel.channelType,
	    color: undefined,
	    archivedAt: archivedAt
		})
	})

	if(res.status === 200) {
		emits('archive', {color:undefined,archivedAt})
	}
}


const props = defineProps<{
	channel: Channel
	sender?: string
}>()

const emits = defineEmits<{
	archive: [value: string]
}>()

</script>