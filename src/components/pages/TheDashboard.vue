 <template>
 	<DashboardLayout>
 		<template #messages>
			<VChatList class="h-3/6" title="messages" button-text="Create new channel"/>
 		</template>
 		 <template #channels>
			<VChatList class="h-2/6" title="channels"/>
 		</template>
 		<template #chatbox>
 			<VChatTitle name="Vauldex Tech" :count="12"/>
 			<VChatBoxArea class="flex-1"/>
 			<VChatBox/>
 		</template>
 		<template #chatinfo>
 			<VChatInfo 
 					:images="[]"
 					:files="[]"
 					:members="[]"
 					title="channel information"
 					name="Vauldex Tech" />
 		</template>
 	</DashboardLayout>
</template>

<script lang="ts" setup>
import DashboardLayout from "@/components/templates/DashboardLayout.vue"
import VChatList from "@/components/organisms/VChatList.vue"
import VChatTitle from "@/components/organisms/VChatTitle.vue"
import VChatInfo from "@/components/organisms/VChatInfo.vue"
import VChatListItem from "@/components/organisms/VChatListItem.vue"
import VChatBox from "@/components/organisms/VChatBox.vue"
import VChatBoxArea from "@/components/organisms/VChatBoxArea.vue"


</script>

