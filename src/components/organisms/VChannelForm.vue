<template>
	<form @submit.prevent>
		<VInput size="md" v-model="channelForm.title"/>
		<VButton size="md" action="submit" @click="createChannel"/>
	</form>
</template>

<script setup lang="ts">
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"
import { ref } from "vue"

interface ChannelData {
	title: string
	channelType: string
	archivedAt?: string
	color?: string
}

const error = ref<string>('')
const channelForm = ref<ChannelData>({
	title: "",
	channelType: ""
})

const createChannel = async () => {
	try {
		const response = await useFetch("/channels", {
			method: "POST",
			body: JSON.stringify(channelForm.value)
		})

		if(response.status !== 200) {
			error.value = "Failed to create channel."
		}
	} catch (err) {
		throw new Error(err)
	} finally {
		title.value = ""
	}
}

</script>