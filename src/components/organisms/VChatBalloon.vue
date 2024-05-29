<template>
	<li
		:class="message.userId === user.id ? `self-end` : 'self-start'"
		class="flex items-start gap-4">
		<VAvatar v-if="message.userId !== user.id" :image="senderProfile"/>
		<div class="flex items-start gap-2 flex-col">
			<div :class="message.userId === user.id ? 'self-end' : ''" class="flex items-center gap-1">
				<template v-if="message.userId !== user.id">
					<p class="text-xs">{{senderName}}</p>
					<p class="text-xs">•</p>
				</template>
				<p class="text-xs">{{sentAtFormatter}}</p>
			</div>
			<p 
					:class="message.userId === user.id ? `${color} self-end text-gray-100` : 'self-start bg-gray-300 text-gray-800 dark:text-gray-300 dark:bg-slate-800'"
					class="p-3 rounded-lg max-w-[250px]">
				{{message.text}}
			</p>
		</div>
	</li>
</template>

<script lang="ts" setup>
import type {Message} from "@/types/Message.ts"
import {useUser} from "@/composables/useUser.ts"
import {useDateFormatter} from "@/composables/useDateFormatter.ts"
import {computed} from "vue"
import {useUserStore} from "@/stores/useUserStore.ts"
import VAvatar from "@/components/atoms/VAvatar.vue"

const user = useUser()
const userStore = useUserStore()
const dateFormatter = useDateFormatter()

const options: Intl.DateTimeFormatOptions = {
	month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

const sentAtFormatter = computed(() => {
	return dateFormatter.format(props.message.sentAt,options)
})

const senderName = computed(() => {
	if(props.message) {
		const user = userStore.getUserById(props.message.userId)[1]
		return user ? `${user.firstName} ${user.lastName}` : "Anonymous"
	} else {
		return "Anonymous"
	}
})

const senderProfile = computed(() => {
	if(props.message) {
		const user = userStore.getUserById(props.message.userId)[1]
		return user ? user.image : undefined
	} else {
		return undefined
	}
})

const props = defineProps<{
	message: Message
	color?: string
}>()
</script>