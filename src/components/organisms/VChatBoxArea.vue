<template>
	<ul ref="chatList" class="bg-gray-100 dark:bg-slate-900 border-b border-b-indigo-200 dark:border-b-slate-800 flex flex-col gap-8 overflow-y-scroll p-5">
		<VChatBalloon v-for="message in messages" :key="message.id" :message="message" :color="color"/>
	</ul>
</template>


<script lang="ts" setup>
import type {Message} from "@/types/Message.ts"
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
	color?: string
}>()
</script>