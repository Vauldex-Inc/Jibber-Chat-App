<template>
	<div class="flex flex-col justify-between gap-4 w-96 h-54 rounded-md bg-white shadow-md dark:bg-slate-900 text-gray-700 p-5">
		<header>
			<h4 class="inline font-bold text-gray-600 dark:text-gray-300">Invitation</h4>
		</header>
		<hr class="border-0 border-b border-b-indigo-300 dark:border-b-slate-800"/>
		<div class="flex items-center gap-4 p-5">
			<span class="p-4 bg-indigo-600 rounded-full flex items-center justify-center">
				<img src="@/assets/images/notif.svg" class="h-8 aspect-square"/>
	    </span>
			<p class="text-center dark:text-gray-400">{{senderName}} invited you to join his/her channel.</p>
		</div>
		<hr class="border-0 border-b border-b-indigo-300 dark:border-b-slate-800"/>
		<footer class="flex gap-4 self-end">
			<VButton class="border bg-indigo-300 dark:bg-slate-800 dark:border-slate-800 dark:text-gray-400 rounded-md text-slate-700" @click="emits('close')">Close</VButton>			
			<VButton class="border dark:border-slate-800 bg-indigo-600 rounded-md text-white" @click="emits('view',notif.channelId)">Take a Look</VButton>
		</footer>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/atoms/VButton.vue"
import {useUserStore} from "@/stores/useUserStore"
import {computed} from "vue"
import type {Invitation} from "@/types/Invitation"

const userStore = useUserStore()

const props = defineProps<{
	notif: Invitation
}>()

const senderName = computed(() => {
	return userStore.getUserNameById(props.notif.senderId)
})

const emits = defineEmits<{
	close: []
	view: [value: string]
}>()

</script>

