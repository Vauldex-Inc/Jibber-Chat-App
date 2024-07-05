<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 p-3">
      <p class="text-2xl font-bold capitalize text-gray-700 dark:text-gray-300">
        {{ header.title }}
      </p>
      <VIconButton
        class="bg-slate-700 dark:bg-slate-800"
        icon="./src/assets/images/add.svg"
        size="small"
        @click="open = true"
      >
      </VIconButton>
    </div>
    <ul class="overflow-y-scroll bg-white pb-5 dark:bg-slate-950">
      <template v-if="channels.length > 0">
        <li 
          v-for="channel in channels" 
          class="flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-indigo-400/10"
          :key="channel.id" @click="set(channel)">
          <VAvatar :image="getImage(user(channel))" :status="getStatus(user(channel))"size="xlarge"/>

          <VTextGroup
            :is-bold="getUnreadMessages(channel.id).length > 0"
            class="flex-1"
            :title="getName(user(channel))"
            :text="latestMessage(channel.id)?.text"
          />
          
          <div v-if="!channel.archivedAt" class="flex flex-col items-center gap-2">
            <span class="text-sm">{{ formatSentAt(latestMessage(channel.id)!.sentAt) }}</span>
            <VBadge
              v-if="getUnreadMessages.length > 0"
              :count="getUnreadMessages.length"
              :color="channel.color"
            />
          </div>
        </li>
      </template>
      <li v-else class="h-full pb-5 pt-10 text-center">No channels found.</li>      
    </ul>
  </div>

  <VModal @close="open = false" :is-open="open" >
    <InvitationDirect />
  </VModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { storeToRefs } from "pinia"
  import {useUserProfileStore} from "@/stores/useUserProfileStore"
  import {useUserStore} from "@/stores/useUserStore"
  import {useChannelStore} from "@/stores/useChannelStore"
  import {useUnreadMessageStore} from "@/stores/useUnreadMessageStore"
  import {useDirectChannelStore} from "@/stores/useDirectChannelStore"
  import { useMessageStore } from '@/stores/useMessageStore'
  import { formatSentAt } from '@/composables/useDateFormatter'
  import { useUser } from '@/composables/useUser'
  import type { DirectChannel } from '@/types/Channel'
  import VModal from '../atoms/VModal.vue'
  import InvitationDirect from './InvitationDirect.vue'
  import VBadge from '../atoms/VBadge.vue'
  import VTextGroup from '../molecules/VTextGroup.vue'
  import VAvatar from '../molecules/VAvatar.vue'
  import VIconButton from '@/components/molecules/VIconButton.vue'

  const { getImage, getName } = useUserProfileStore()
  const { getStatus } = useUserStore()
  const { set } = useChannelStore()
  const { channels } = useDirectChannelStore()
  const { getUnreadMessages } = useUnreadMessageStore()
  const { getLatestMessages } = useMessageStore()
  const loggedUser = useUser()
  const header = {
    title: "Messages"
  }
  const open = ref<boolean>(false)

  const latestMessage = (idChannel: string) => {
    const unReadMessages = getUnreadMessages(idChannel)
    if (getUnreadMessages(idChannel).length > 0) {
      return unReadMessages[unReadMessages.length - 1]
    }

    const messages = getLatestMessages(idChannel).filter((m) => m.idChannel === idChannel)

    if (messages.length > 0) {
      return messages[messages.length - 1]
    }
  }

  const user = (channel: DirectChannel) => {
    return loggedUser?.id === channel.idUser ? channel.idReceiver : channel.idUser
  }
</script>
