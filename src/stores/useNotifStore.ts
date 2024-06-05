import { ref } from "vue"
import { defineStore } from "pinia"
import { useFetch } from "@/composables/useFetch"

const useNotifStore = defineStore("notifications", () => {
	const notifs = ref([])



	return { notifs }
})