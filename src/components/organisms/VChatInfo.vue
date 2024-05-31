<template>
	<div class="h-full flex flex-col">
		<p class="capitalize text-gray-700 dark:text-gray-300 text-xl font-bold border-b 
					border-b-indigo-200 dark:border-b-slate-800 py-[30px] px-5 bg-white dark:bg-slate-950 z-40">
			{{title}}
		</p>
		<div class="overflow-y-scroll flex-1 bg-white dark:bg-slate-950 pb-24">
			<div class="flex flex-col items-center justify-center gap-5 px-5 pb-5 pt-16">
				<template v-if="channel.channelType === 'SNG'">
					<div>
						<VAvatar size="lg" :image="senderProfile"/>
						<p class="text-sm text-center">Offline</p>
					</div>
					<p class="font-semibold">{{senderName}}</p>
				</template>
				<template v-else>
					<div 
							class="h-16 aspect-square flex items-center justify-center rounded-full text-white"
							:class="curColorTheme"
							>
							<p class="text-xl">{{channelAbbr}}</p>
					</div>
					<p class="font-semibold">{{channel.title}}</p>
				</template>
				<div class="flex items-center justify-center gap-4">
					<div class="group flex flex-col gap-2 items-center justify-center">
						<VIconButton 
								@click="openMemberInvite"
                :disabled="channel.archivedAt !== undefined"
								icon="./src/assets/images/add.svg"
								:class="{'opacity-50' : channel.archivedAt}"
								class="bg-indigo-100 border-2 border-indigo-200 dark:bg-slate-950 dark:border-slate-800 dark:group-hover:bg-slate-900 group-hover:border-slate-500 dark:group-hover:border-slate-800" 
								:invert="true"/>
						<p class="text-sm text-gray-600 dark:text-slate-400">Member</p>
					</div>
					<div class="group flex flex-col gap-2 items-center justify-center">
						<VIconButton
								:disabled="channel.archivedAt !== undefined"
								@click="openThemeSelector"
								icon="./src/assets/images/theme.svg"
								:class="{'opacity-50' : channel.archivedAt}"
								class="bg-indigo-100 border-2 border-indigo-200 dark:bg-slate-950 dark:border-slate-800 dark:group-hover:bg-slate-900 group-hover:border-slate-500 dark:group-hover:border-slate-800" 
								:invert="true"/>
						<p class="text-sm text-gray-600 dark:text-slate-400">Theme</p>
					</div>
				</div>
			</div>
			<hr class="border-0 border-b border-b-indigo-200 dark:border-b-slate-800 my-5" />
			<VSection :color="channel.color" class="p-5" title="Members" actionButton="View All">
				<div class="flex items-center gap-3 p-3">
					<img src="@/assets/images/profile.svg" class="h-8 aspect-square dark:invert">
					<p>{{count && count > 1 ? `${count} members` : `${count} member`}}</p>
				</div>
			</VSection>
			<hr class="border-0 border-b border-b-indigo-200 dark:border-b-slate-800 my-5" />
			<VSection :color="channel.color" class="p-5" title="Images" actionButton="View All">
				<div class="p-3">
					<ul v-if="images.length !== 0">
						
					</ul>
					<p v-else class="text-center">No images found</p>
				</div>
			</VSection>
			<hr class="border-0 border-b border-b-indigo-200 dark:border-b-slate-800 my-5" />
			<VSection :color="channel.color" class="p-5" title="Files" actionButton="View All">
				<div class="p-3">
					<ul v-if="files.length !== 0">
						
					</ul>
					<p v-else class="text-center">No files found</p>
				</div>
			</VSection>
		</div>
		
		<VModal @close="closeMemberInvite" :isOpen="stateMemberInvite">
			<VMemberInvitation />
		</VModal>
		<VModal @close="closeThemeSelector" :isOpen="stateThemeSelector">
			<VChatColorSelector @color="selectColor" />
		</VModal>
	</div>
</template>

<script lang="ts" setup>
import VSection from "@/components/molecules/VSection.vue"
import VAvatar from "@/components/atoms/VAvatar.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import VModal from "@/components/atoms/VModal.vue"
import VChatColorSelector from "@/components/organisms/VChatColorSelector.vue"
import VMemberInvitation from "@/components/organisms/VMemberInvitation.vue"
import { ref, computed  } from "vue"
import {useUserStore} from "@/stores/useUserStore.ts"
import {useFetch} from "@/composables/useFetch.ts"

const userStore = useUserStore()

interface VChatInfoProps {
	count: number;
	channel: Channel;
	title: string;
	sender?: string;
}

const files = computed(() => {
	return []
})

const images = computed(() => {
	return []
})

const senderName = computed(() => {
	if(!props.sender) return ""
	return userStore.getUserNameById(props.sender)
})

const senderProfile = computed(() => {
	if(!props.sender) return undefined
	return userStore.getUserImageById(props.sender)
})

const channelAbbr = computed(() => {
	return props.channel.title.slice(0,1)
})

const curColorTheme = computed(() => {
	return props.channel.color ? props.channel.color : "bg-slate-800"
})

const stateMemberInvite = ref<boolean>(false)
const openMemberInvite = () => stateMemberInvite.value = true
const closeMemberInvite = () => stateMemberInvite.value = false

const stateThemeSelector = ref<boolean>(false)
const openThemeSelector = () => stateThemeSelector.value = true
const closeThemeSelector = () => stateThemeSelector.value = false



const selectColor = async (color: string) => {
	isOpen.value = false
	const res = await useFetch(`/channels/${props.channel.id}`, {
		method: "PUT",
		body: JSON.stringify({
	    title: props.channel.title,
	    channelType: props.channel.channelType,
	    color: color
		})
	})

	if(res.status === 200) {
		emits('colorUpdate', color)
	}
}

const props = defineProps<VChatInfoProps>()

const emits = defineEmits<{
	colorUpdate: [value: string]
}>()

</script>