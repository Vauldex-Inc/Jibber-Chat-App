 <template>
 	<VModal :is-open="variant === 'SNG'" @close="variant = undefined">
 		<VInvitationDirect color="bg-indigo-600" @submit="newDirect"/>
 	</VModal>
 	<VModal :is-open="variant === 'MPU'" @close="variant = undefined">
 		<VChannelForm :variant="variant" @submit="newChannel" />
 	</VModal>
 	<DashboardLayout>
 		<template #messages>
			<VChatList @open="openChannel" @click="variant = 'SNG'" :items="privateChannels" class="h-3/6" title="messages"/>
 		</template>
 		 <template #channels>
			<VChatList @open="openChannel" @click="variant = 'MPU'" :items="multiChannels" class="h-2/6" title="channels"/>
 		</template>
 		<template #chatbox>
 			<template v-if="selectedChannel" >
	 			<VChatTitle @archive="updateArchived" :channel="selectedChannel" :sender="senderId" :count="channelUsersCount"/>
	 			<VChatBoxArea :channel="selectedChannel" :messages="messages" class="flex-1"/>
	 			<VChatBox @send="sendMessage" :channel="selectedChannel"/>
 			</template>
 		</template>
 		<template #actions>
 			<VSettings />
 		</template>
 		<template #chatinfo>
 			<template v-if="selectedChannel" >
			 <VChatInfo
			 	@color-update="updateColor" 
				:channel="selectedChannel" 
				:sender="senderId" 
				:count="channelUsersCount"
				title="channel information" />
 			</template>
 		</template>
 	</DashboardLayout>
</template>

<script lang="ts" setup>
import DashboardLayout from "@/components/templates/DashboardLayout.vue"
import VChatList from "@/components/organisms/VChatList.vue"
import VChatTitle from "@/components/organisms/VChatTitle.vue"
import VChatInfo from "@/components/organisms/VChatInfo.vue"
import VChatBox from "@/components/organisms/VChatBox.vue"
import VChatBoxArea from "@/components/organisms/VChatBoxArea.vue"
import VChannelForm	from "@/components/organisms/VChannelForm.vue"
import VModal from "@/components/atoms/VModal.vue"
import VInvitationDirect from "@/components/organisms/VInvitationDirect.vue"
import {useUserStore} from "@/stores/useUserStore.ts"
import {useChannelStore} from "@/stores/useChannelStore.ts"
import {useMessageStore} from "@/stores/useMessageStore.ts"
import {onMounted,ref,watch,computed} from "vue"
import type {Message} from "@/types/Message.ts"
import type {Channel} from "@/types/Channel.ts"
import {useUser} from "@/composables/useUser.ts"
import {useChannelUserStore} from "@/stores/useChannelUserStore.ts"
import { useFetch } from "@/composables/useFetch"
import { useSocket } from "@/composables/useSocket.ts"

import VSettings from "@/components/organisms/VSettings.vue"

const userStore = useUserStore()
const channelStore = useChannelStore()
const messageStore = useMessageStore()
const channelUserStore = useChannelUserStore()
const loggedUser = useUser()
const messages = ref<Message[]>([])
const senderId = ref<string | undefined>(undefined)
const channelUsersCount = ref<number>(0)

const multiChannels = channelStore.getMultiChannels()
const singleChannels = channelStore.getSingleChannels()
const privateChannels = ref<Channel[]>([])
const selectedChannel = ref<Channel | undefined>(undefined)
const activeSocket = ref<WebSocket | undefined>(undefined)

const variant = ref<"MPU" | "MPR" | "SNG" | undefined>()

const openChannel = (id: string) => {
	selectedChannel.value = channelStore.getChannelById(id)
}

const newChannel = (channel: Channel | undefined) => {
	if(channel){
		channelStore.addNewChannel(channel)
	}
	variant.value = undefined
}

const newDirect = (channel: Channel | undefined) => {
	if(channel){
		channelStore.addNewChannel(channel)
	}
	variant.value = undefined
}

const updateColor = (color: string) => {
	selectedChannel.value.color = color
}

const updateArchived = (archivedAt: string) => {
	selectedChannel.value.archivedAt = archivedAt
}

const sendMessage = (message: string, img: string | undefined) => {
	messageStore.sendMessage(selectedChannel.value.id,message,img)
}

watch(selectedChannel, async (channel) => {
	if(channel){
		const users = await channelUserStore.getChannelUsers(channel.id)

		messages.value = await messageStore.getChannelMessages(channel.id)
		channelUsersCount.value = users.length

		if(channel.channelType === "SNG") {
			const sender = users.find(u => u.userId !== loggedUser.id)
			senderId.value = sender.userId
		}
		if(activeSocket.value) {
			activeSocket.value.close();
		}
		activeSocket.value = useSocket(`/channels/${channel.id}`, (data: MessageEvent) => {
			const dataJson = JSON.parse(data.data)
			const newMessage = dataJson.messages

			if(!newMessage) return

			messages.value.push(newMessage)
		})
	}
})

watch(singleChannels, async (channels) => {
	privateChannels.value = []
	channels.forEach(async (c) => {
		const users = await channelUserStore.getChannelUsers(c.id)
		if(users.some(u => u.userId === loggedUser.id)) {
			privateChannels.value.push(c)
		}
	})
})

onMounted(async () => {
	await userStore.init()
	await channelStore.init()


	selectedChannel.value = privateChannels.value.length > 0 ?  privateChannels.value[0] : multiChannels.value[0]
})
</script>

