<template>
	<form @submit.prevent="create" class="flex flex-col gap-4 bg-white shadow-md p-5 rounded-md w-[420px] dark:bg-slate-900">
		<h4 v-if="variant === 'MPU'" class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Create new public channel</h4>
		<h4 v-else class="pb-2 font-semibold text-gray-600 dark:text-gray-300 text-lg">Direct message</h4>
		<p v-if="error" class="text-red-500 text-center text-sm border border-red-600 bg-red-500/10 p-3 rounded-md">{{ error }}</p>
		<VInput class="bg-gray-50 dark:bg-slate-800 rounded-md border-2 w-full pr-12 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" size="md" v-model="channelForm.title" v-focus :placeholder="variant === 'MPU' ? 'Channel name' : 'Name' "/>
		<VButton class="bg-indigo-600 text-md text-white rounded-md mt-4" size="md" action="submit">Submit</VButton>
	</form>
</template>

<script setup lang="ts">
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"
import { Channel } from "@/types/Channel.ts"
import { useFetch } from "@/composables/useFetch.ts"
import { useRouter } from "vue-router"
import { ref, computed } from "vue"

interface ChannelData {
	title: string
	channelType: string
	archivedAt?: string
	color?: string
}

const router = useRouter()
const emits = defineEmits<{
	submit: [value: Channel | undefined]
}>()
const props = defineProps<{
	variant: "MPU" | "MPR" | "SNG"
}>()

const error = ref<string>('')
const channelForm = ref<ChannelData>({
	title: "",
	channelType: props.variant
})

const vFocus = {
  mounted: (el) => el.focus()
}


const create = async () => {
	try {
		if(channelForm.value.title) {
			const response = await useFetch("/channels", {
				method: "POST",
				body: JSON.stringify(channelForm.value)
			})

			if(response.status === 200) {
				const result = await response.json()

				const channel = result.channel

				const res = await useFetch(`/channels/${channel.id}/users`, {
					method: "POST",
					body: JSON.stringify({})
				})

				emits('submit', channel)
			}
		} else {
			if(props.variant === "MPU") {
				error.value = "Please provide a channel name."
			} else {
				error.value = "Please provide a name."
			}
		}
	} catch (err) {
		emits('submit', undefined)
		throw new Error(err)
	} finally {
		setTimeout(() => {
			error.value = ""
		}, 1500)
	}
}

</script>