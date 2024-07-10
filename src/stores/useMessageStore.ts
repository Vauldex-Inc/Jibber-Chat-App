import { ref, computed, type Ref } from "vue"
import { defineStore } from "pinia"
import axios, { AxiosError } from "axios"
import type { ZodError } from "zod"
import { MessageSchema, type Message } from "@/types/Message"

export const useMessageStore = defineStore("messages", () => {
	const latestMessages = ref<Array<Message>>([])
	const _messages = ref<Array<Message>>([])

	const chatImages = computed(() => {
		return _messages.value.map((m: Message) => m.image ? m.image : "")
	})

	const chatMessages = computed(() => {
		return _messages.value
	})

	const fetch = async () => {
		await fetchLatest("/channels/latest-messages")
		await fetchLatest("/me/channels/latest-messages")
	}

	const set = (list: Message[]) => _messages.value = list

	const fetchLatest = async (url: string) => {
		try {
			const { data } = await axios.get(url)
			const validation = MessageSchema.array().safeParse(data.filter((d: Message) => d !== null))
			if (validation.success) {
				if(url.split("/").includes("me")) {
					latestMessages.value.push(...validation.data)
				} else {
					latestMessages.value = validation.data
				}
			} else {
				throw new Error("Unsupported Format")
			}

		} catch (error) {
			error instanceof Error ? console.error : ""
		}
	}

	const getChannelMessages = async (idChannel: string) => {
		try {
			const { data } = await axios.get(`/channels/${idChannel}/messages`)
			const list = data.messages.map((m: unknown) => MessageSchema.parse(m))
			set(list)
		} catch (e) {
			const error = e as AxiosError | ZodError
			console.error(error.message)
		}
	}

	const sendMessage = async (
		idChannel: string,
		message: string, 
		img: string | undefined
	) => {
		const { data } = await axios.post(`/channels/${idChannel}/messages`, {
			text: message,
			image: img
		})
		const messageValidation = MessageSchema.safeParse(data.messages)

		if (messageValidation.success) {
			latestMessages.value.push(messageValidation.data)
		} else {
			throw Error("Unknown Format")
		}
	}

	const addNewLatestMessage = (message: Message) => {
		latestMessages.value.push(message)
	}

	const getLatestMessages = (idChannel: string) => latestMessages.value.filter((m) => m.idChannel === idChannel)

	return {
		getChannelMessages,
		sendMessage,
		latestMessages,
		chatImages,
		chatMessages,
		fetch,
		getLatestMessages,
		addNewLatestMessage
	}
})