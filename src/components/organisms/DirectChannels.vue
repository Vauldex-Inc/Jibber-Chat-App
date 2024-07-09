<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 p-3 sticky top-0 z-20 dark:bg-slate-950 bg-white">
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
      <template v-if="transformChannels.length > 0">
        <li 
          v-for="channel in transformChannels" 
          class="flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-indigo-400/10"
          :key="channel.id" 
          @click="onClickChannel(channel.id)"
        >
          <VAvatar :image="channel.image" :status="channel.status" size="xlarge"/>

          <VTextGroup
            :is-bold="channel.hasUnread"
            class="flex-1"
            :title="channel.name!"
            :text="channel.text"
          />
          
          <div v-if="!channel.archivedAt" class="flex flex-col items-center gap-2">
            <span class="text-sm">{{ channel.sentAt }}</span>
            <VBadge
              v-if="getUnreadMessages.length > 0"
              :count="getUnreadMessages.length"
              :color="channel.color"
            />
          </div>
          <p v-else
          class="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-500 dark:border-red-500/20"
          >
            Archived
          </p>
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
  import { computed, ref, type Ref } from 'vue'
  import {useProfileStore} from "@/stores/useProfileStore"
  import {useUserStore} from "@/stores/useUserStore"
  import {useChannelStore} from "@/stores/useChannelStore"
  import {useUnreadMessageStore} from "@/stores/useUnreadMessageStore"
  import {useDirectChannelStore} from "@/stores/useDirectChannelStore"
  import { useMessageStore } from '@/stores/useMessageStore'
  import { formatSentAt } from '@/composables/useDateFormatter'
  import { useUser } from '@/composables/useUser'
  import type { UnreadMessage, Message } from '@/types/Message'
  import VModal from '../atoms/VModal.vue'
  import InvitationDirect from './InvitationDirect.vue'
  import VBadge from '../atoms/VBadge.vue'
  import VTextGroup from '../molecules/VTextGroup.vue'
  import VAvatar from '../molecules/VAvatar.vue'
  import VIconButton from '@/components/molecules/VIconButton.vue'

  const { getImage, getName } = useProfileStore()
  const { getStatus } = useUserStore()
  const channel = useChannelStore()
  const { channels } = useDirectChannelStore()
  const { getUnreadMessages, hasUnread } = useUnreadMessageStore()
  const { getLatestMessages } = useMessageStore()
  const { removeUnreadMessages } = useUnreadMessageStore()
  const loggedUser = useUser()
  const header = {
    title: "Direct Messages"
  }
  const open = ref<boolean>(false)

  const latestMessage = (idChannel: string): { text: string, sentAt: string } => {
    let message = {} as UnreadMessage | Message
    const unReadMessages = getUnreadMessages(idChannel)
    if (getUnreadMessages(idChannel).length > 0) {
      message = unReadMessages[unReadMessages.length - 1]
    }
    const messages = getLatestMessages(idChannel).filter((m) => m.idChannel === idChannel)
    if (messages.length > 0) {
      message = messages[messages.length - 1]
    }
    return {
      text: message.text || "",
      sentAt: message.sentAt
    }
  }

  const setId = (idUser: string, idReceiver: string) => {
    return loggedUser?.id === idUser ? idReceiver : idUser
  }

  const transformChannels = computed(() => channels.value.map((r) => {
    const id = setId(r.idUser, r.idReceiver)
    const { text, sentAt } = latestMessage(r.id)

    return {
      id: r.id,
      image: getImage(id),
      status: getStatus(id),
      name: getName(id) || "",
      sentAt: formatSentAt(sentAt),
      text,
      color: r.color,
      archivedAt: r.archivedAt,
      hasUnread: hasUnread(r.id)
    }
  }))

  const onClickChannel = (idChannel: string) => {
    const _channel = channels.value.find((r) => r.id === idChannel)
    
    if (_channel) {
      channel.set(_channel)
    }

    removeUnreadMessages(idChannel)
  }
</script>
