<template>
	<div class="flex flex-col gap-2">
		<div class="p-3 flex items-center justify-between gap-4">
			<p class="text-2xl font-bold text-gray-700 dark:text-gray-300 capitalize">{{title}}</p>
			<VIconButton
					class="bg-slate-700 dark:bg-slate-800"
					icon="./src/assets/images/add.svg"
					size="md"
          @click="emits('click')">
			</VIconButton>
		</div>
		<ul class="overflow-y-scroll pb-5 bg-white dark:bg-slate-950">
			<template v-if="items.length !==0">
				<VChatListItem @open="openChannel" v-for="item in items" :key="item.id" :item="item" />
			</template>
			<p v-else class="h-full text-center pt-10 pb-5">No channels found.</p>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import VChatListItem from "@/components/organisms/VChatListItem.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import type {Channel} from "@/types/Channel.ts"


defineProps<{
	title: string
	items: Channel[]
}>()

const openChannel = (id: string) => {
	emits('open',id)
}

const emits = defineEmits<{
	open: [value: string]
	click: []
}>()
</script>