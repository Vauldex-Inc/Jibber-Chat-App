<template>
  <div
    v-if="loggedUser"
    class="flex items-start gap-4"
  >
    <VAvatar
      v-if="!messageData.isOwn"
      :image="messageData.senderAvatar"
      :status="messageData.senderStatus"
      type="message"
      size="xlarge"
    />
    <div class="flex flex-col items-start gap-2">
      <div
        :class="messageData.alignment"
        class="flex items-center gap-1"
      >
        <template v-if="!messageData.isOwn">
          <p class="text-xs">{{ messageData.senderName }}</p>
          <p class="text-xs">•</p>
        </template>
        <p class="text-xs">{{ messageData.sentAt }}</p>
      </div>
      <p
        :class="messageClass"
        class="max-w-[250px] break-words rounded-lg p-3"
      >
        {{ message.text }}
        <img
          v-if="message.image"
          class="mt-2 aspect-auto max-h-48 rounded-md"
          :src="message.image"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { useUser } from "@/composables/useUser"
import { useUserStore } from "@/stores/useUserStore"
import { useProfileStore } from "@/stores/useProfileStore"
import VAvatar from "@/components/molecules/VAvatar.vue"
import type { Message } from "@/types/Message"
import { computed } from "vue"
import { useChannelStore } from "@/stores/useChannelStore"

const prop = defineProps<{
  message: Message
}>()

const userStore = useUserStore()
const profileStore = useProfileStore()
const loggedUser = useUser()
const { channel } = storeToRefs(useChannelStore())

const messageData = computed(() => {
  return {
    color: channel.value.color || 'bg-gray-600',
    alignment: prop.message.idUser === loggedUser?.id ? `self-end` : 'self-start',
    isOwn: prop.message.idUser === loggedUser?.id,
    senderAvatar: profileStore.getImage(prop.message.idUser),
    senderStatus: userStore.getStatus(prop.message.idUser),
    senderName: profileStore.getName(prop.message.idUser),
    sentAt: userStore.sentAtFormatter(prop.message)
  }
})

const messageClass = computed(() => [ 
  messageData.value.alignment,
  messageData.value.isOwn ?' text-gray-100' : 'text-gray-800 dark:text-gray-300',
  channel.value.color && messageData.value.isOwn ? channel.value.color : 'bg-gray-300 text-gray-800 dark:bg-slate-800 dark:text-gray-300'
])


</script>
