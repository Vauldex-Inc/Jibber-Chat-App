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
		<ul class="overflow-y-scroll pb-5">
			<VChatListItem v-for="n in 20" :key="n" />
		</ul>
	</div>
</template>

<script lang="ts" setup>
import VChatListItem from "@/components/organisms/VChatListItem.vue"
import VButton from "@/components/atoms/VButton.vue"


defineProps<{
	title: string
	buttonText?: string;
}>()
</script>