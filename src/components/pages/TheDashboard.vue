 <template>
 	<VModal :is-open="show" @close="show = false">
 		<VChannelForm @submit="newChannel" />
 	</VModal>
 	<DashboardLayout>
 		<template #messages>
			<VChatList @open="openChannel" @click="show = true" :items="privateChannels" class="h-3/6" title="messages" button-text="Create new channel"/>
 		</template>
 		 <template #channels>
			<VChatList @open="openChannel" :items="multiChannels" class="h-2/6" title="channels"/>
 		</template>
 		<template #chatbox>
 			<template v-if="selectedChannel" >
	 			<VChatTitle :channel="selectedChannel" :sender="senderId" :count="channelUsersCount"/>
	 			<VChatBoxArea :messages="messages" class="flex-1" :color="selectedChannel.color"/>
	 			<VChatBox/>
 			</template>
 		</template>
 		<template #actions>
 			<VIconButton class="bg-slate-200 dark:bg-slate-800" :rounded="true" size="md" icon="./src/assets/images/logout.svg" @click="logout" />
 			<VThemeSelector />
 		</template>
 		<template #chatinfo>
 			<template v-if="selectedChannel" >
			 <VChatInfo 
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
import VChatListItem from "@/components/organisms/VChatListItem.vue"
import VChatBox from "@/components/organisms/VChatBox.vue"
import VChatBoxArea from "@/components/organisms/VChatBoxArea.vue"
import VChannelForm	from "@/components/organisms/VChannelForm.vue"
import VModal from "@/components/atoms/VModal.vue"
import {useUserStore} from "@/stores/useUserStore.ts"
import {useChannelStore} from "@/stores/useChannelStore.ts"
import {useMessageStore} from "@/stores/useMessageStore.ts"
import {onMounted,ref,watch,computed} from "vue"
import type {Message} from "@/types/Message.ts"
import type {Channel} from "@/types/Channel.ts"
import {useUser} from "@/composables/useUser.ts"
import {useChannelUserStore} from "@/stores/useChannelUserStore.ts"
import VThemeSelector from "@/components/organisms/VThemeSelector.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import { useRouter } from "vue-router"
import { useFetch } from "@/composables/useFetch"

const router = useRouter()
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

const show = ref<boolean>(false)

const openChannel = (id: string) => {
	selectedChannel.value = channelStore.getChannelById(id)
}

const newChannel = (channel: Channel | undefined) => {
	if(channel){
		channelStore.addNewChannel(channel)
	}
	show.value = false
}

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

watch(selectedChannel, async (channel) => {
	if(channel){
		const users = await channelUserStore.getChannelUsers(channel.id)

		messages.value = await messageStore.getChannelMessages(channel.id)
		channelUsersCount.value = users.length

		if(channel.channelType === "SNG") {
			const sender = users.find(u => u.userId !== loggedUser.id)
			senderId.value = sender.userId
		}
	}
})

watch(singleChannels, async (channels) => {
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

