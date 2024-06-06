<template>
	<div @click="openChannel" class="flex items-center p-3 gap-4 hover:bg-indigo-400/10 cursor-pointer transition-all">
		<template v-if="item.channelType === 'SNG'">
			<VAvatar :image="senderProfile" :status="senderStatus"/>
			<VTextGroup :is-bold="unReadMessages.length > 0" class="flex-1" :title="senderName" :text="latestMessage ? latestMessage.text : ''"/>
		</template>
		<template v-else>
			<div 
					class="h-12 aspect-square flex items-center justify-center rounded-full text-white"
					:class="color"
					>
					<p>{{channelAbbr}}</p>
			</div>
			<VTextGroup :is-bold="unReadMessages.length > 0" class="flex-1" :title="item.title" :text="latestMessage ? latestMessage.text : ''"/>
		</template>
		<div v-if="!item.archivedAt" class="flex items-center flex-col gap-2">
			<p class="text-sm">{{sentAt}}</p>
			<VBadge v-if="unReadMessages.length > 0" :count="unReadMessages.length" :color="color"/>
		</div>
		<p v-else class="bg-red-500/10 border border-red-500/40 dark:border-red-500/20 text-red-500 py-1 px-3 rounded-full text-xs">
			Archived
		</p>
	</div>
</template>

<script lang="ts" setup>
import VAvatar from "@/components/atoms/VAvatar.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"
import type { Channel } from "@/types/Channel"
import {useUserStore} from "@/stores/useUserStore.ts"
import {computed, onMounted,ref} from "vue"
import {useFetch} from "@/composables/useFetch.ts"
import {formatSentAt} from "@/utils/formatSentAt.ts"
import {useMessageStore} from "@/stores/useMessageStore.ts"
import {useUser} from "@/composables/useUser.ts"
import {useUnreadMessageStore} from "@/stores/useUnreadMessageStore"
import {useChannelUserStore} from "@/stores/useChannelUserStore.ts"

const emits = defineEmits<{
	open: [value: string]
}>()

const loggedUser = useUser()
const userStore = useUserStore()
const messageStore = useMessageStore()
const channelUserStore = useChannelUserStore()
const unreadMessageStore = useUnreadMessageStore()

const unReadMessages = computed(() => {
	return unreadMessageStore.getUnreadMessages().value.filter(ur => ur.channelId === props.item.id)
})

const senderName = computed(() => {
	return senderId.value? userStore.getUserNameById(senderId.value) : "Anonymous"
})

const senderProfile = computed(() => {
	return senderId.value? userStore.getUserImageById(senderId.value) : undefined
})

const senderStatus = computed(() => {
	if(!senderId.value) return undefined
	return userStore.getOnlineUsers().value.indexOf(senderId.value) !== -1 ? 'online' : 'offline'
})

const senderId = ref<string | undefined>(undefined)

const color = computed(() => {
	return props.item.color? props.item.color.trim() : 'bg-gray-500 dark:bg-slate-800'
})

const channelAbbr = computed(() => {
	return props.item.title.slice(0,1)
})

const latestMessage = computed(() => {

	if(unReadMessages.value.length > 0){
		return unReadMessages.value[unReadMessages.value.length -1]
	} 

	const messages = messageStore.getLatestMessages().value.filter(m => {
		if(m){
			return m.channelId === props.item.id
		}
	})
	
	if(messages.length > 0) {
		return messages[messages.length -1]
	}

})


const sentAt = computed(() => {
	return latestMessage.value ? formatSentAt(latestMessage.value.sentAt) : ''
})



const openChannel = () => {
	unreadMessageStore.removeUnreadMessages(props.item.id)
	emits("open",props.item.id)
}


const props = defineProps<{
	item: Channel
}>()


onMounted(async () => {
	await channelUserStore.getChannelUsers(props.item.id)

	if(props.item.channelType === "SNG") {
		const users = props.item.title.split("/")
		const sender = users.find(u => u !== loggedUser.id)

		if(sender) {
			senderId.value = sender
		}
	}
})
</script>