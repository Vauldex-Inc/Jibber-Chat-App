<template>
	<ul ref="chatList"
		:class="{'opacity-50': channel.archivedAt}"
		 class="bg-gray-100 dark:bg-slate-900 border-b border-b-indigo-200 dark:border-b-slate-800 flex flex-col gap-8 overflow-y-scroll p-5">
		<VChatBalloon v-for="message in messages" :key="message.id" :message="message" :color="channel.color"/>
		<template v-if="channel.archivedAt">
			<hr class="border-0 border-b border-b-slate-300 dark:border-b-slate-800">
			<p class="py-28 text-center text-lg font-semibold text-gray-600 dark:text-gray-500"
				>
				This channel have been archived by the owner
			</p>
		</template>
	</ul>
</template>


<script lang="ts" setup>
import type {Message} from "@/types/Message.ts"
import type {Channel} from "@/types/Channel.ts"
import VChatBalloon from "@/components/organisms/VChatBalloon.vue"
import {onUpdated,ref} from "vue"


const chatList = ref<HtmlElement | undefined>(undefined)

onUpdated(() => {
	if(chatList.value) {
		chatList.value.scrollTo({behavior:"smooth",top:chatList.value.scrollHeight})
	}
})

const props = defineProps<{
	messages: Message[]
	channel: Channel
}>()
</script>