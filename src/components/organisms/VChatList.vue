<template>
	<div class="flex flex-col gap-2">
		<div class="p-3 flex flex-col gap-4">
			<p class="text-2xl font-bold text-gray-700 dark:text-gray-300 capitalize">{{title}}</p>
			<VButton 
					v-if="buttonText"
					class="capitalize bg-indigo-600 rounded-md text-gray-100 font-semibold w-full" 
					size="md" >
				{{buttonText}}
			</VButton>
		</div>
		<ul class="overflow-y-scroll pb-5 bg-gray-50 dark:bg-slate-950">
			<template v-if="items.length !==0">
				<VChatListItem @open="openChannel" v-for="item in items" :key="item.id" :item="item" />
			</template>
			<p v-else class="h-full text-center pt-10 pb-5">No channels found.</p>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import VChatListItem from "@/components/organisms/VChatListItem.vue"
import VButton from "@/components/atoms/VButton.vue"
import type {Channel} from "@/types/Channel.ts"


defineProps<{
	title: string
	buttonText?: string
	items: Channel[]
}>()

const openChannel = (id: string) => {
	emits('open',id)
}

const emits = defineEmits<{
	open: [value: string]
}>()
</script>