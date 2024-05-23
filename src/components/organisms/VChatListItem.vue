<template>
	<div class="flex items-center p-3 gap-4 hover:bg-indigo-500/10 cursor-pointer transition-all">
		<VAvatar/>
		<VTextGroup class="flex-1" title="John Doe" text="lets go eat dinner dude"/>
		<div class="flex items-center flex-col gap-2">
			<p class="text-sm">Just now</p>
			<VBadge :count="12"/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import VAvatar from "@/components/atoms/VAvatar.vue"
import VBadge from "@/components/atoms/VBadge.vue"
import VTextGroup from "@/components/molecules/VTextGroup.vue"
import type { Channel } from "@/types/Channel"



// const props = defineProps<{
// 	item: Channel;
// }>()

const emits = defineEmits<{
	open: [value: string]
}>()
</script>