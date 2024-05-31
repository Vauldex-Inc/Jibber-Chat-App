<template>
	<div @click="emits('open', item.id)" class="flex items-center p-3 gap-4 hover:bg-indigo-500/10 cursor-pointer transition-all">
		<template v-if="item.channelType === 'SNG'">
			<VAvatar :image="senderProfile"/>
			<VTextGroup class="flex-1" :title="senderName" :text="latestMessage ? latestMessage.text : 'Loading...'"/>
		</template>
		<template v-else>
			<div 
					class="h-12 aspect-square flex items-center justify-center rounded-full text-white"
					:class="color"
					>
					<p>{{channelAbbr}}</p>
			</div>
			<VTextGroup class="flex-1" :title="item.title" :text="latestMessage ? latestMessage.text : 'Loading...'"/>
		</template>
		<div v-if="!item.archivedAt" class="flex items-center flex-col gap-2">
			<p class="text-sm">{{sentAt}}</p>
			<VBadge v-if="false" :count="12"/>
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
import {useChannelUserStore} from "@/stores/useChannelUserStore.ts"
import {useUser} from "@/composables/useUser.ts"
import type {Message} from "@/types/Message.ts"


const channelUserStore = useChannelUserStore()

const emits = defineEmits<{
	open: [value: string]
}>()

const loggedUser = useUser()
const userStore = useUserStore()
const messageStore = useMessageStore()

const senderName = computed(() => {
	return senderId.value? userStore.getUserNameById(senderId.value) : "Anonymous"
})

const senderProfile = computed(() => {
	return senderId.value? userStore.getUserImageById(senderId.value) : undefined
})

const senderId = ref<string | undefined>(undefined)

const color = computed(() => {
	return props.item.color? props.item.color.trim() : 'bg-gray-500 dark:bg-slate-800'
})

const channelAbbr = computed(() => {
	return props.item.title.slice(0,1)
})

const sentAt = computed(() => {
	return props.latestMessage ? formatSentAt(props.latestMessage.sentAt) : ''
})


const props = defineProps<{
	item: Channel
	latestMessage?: Message
}>()


onMounted(async () => {
	const users = await channelUserStore.getChannelUsers(props.item.id)
	const sender = users.find(u => u.userId !== loggedUser.id)

	if(sender) {
		senderId.value = sender.userId
	}
})
</script>