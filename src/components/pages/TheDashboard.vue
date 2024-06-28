<template>
  <VModal :is-open="variant === 'SNG'" @close="variant = undefined">
    <VInvitationDirect color="bg-indigo-600" @submit="newDirect" />
  </VModal>
  <VModal :is-open="variant === 'MPU'" @close="variant = undefined">
    <ChannelForm :variant="variant" @submit="newChannel" />
  </VModal>
  <VModal :is-open="invitationModalOpen" @close="closeInvitationModal">
    <VChatInvitation
      :notification="invitationNotif!"
      @view="viewChannel"
      @close="closeInvitationModal"
    />
  </VModal>
  <DashboardLayout :toggle-chat="isChatListOpen" :toggle-info="isChatInfoOpen">
    <template #messages>
      <VChatList
        @open="openChannel"
        @click="variant = 'SNG'"
        :items="directChannels"
        class="h-3/6"
        title="messages"
      />
    </template>
    <template #channels>
      <VChatList
        @open="openChannel"
        @click="variant = 'MPU'"
        :items="multiChannels"
        class="h-2/6"
        title="channels"
      />
    </template>
    <template #chatbox>
      <template v-if="selectedChannel">
        <VChatTitle
          :collapse="isChatListOpen"
          @toggle-chat="toggleChatList"
          @toggle-info="toggleChatInfo"
          @archive="updateArchived"
          :channel="selectedChannel"
          :sender="idSender"
        />
        <VChatBoxArea
          :channel="selectedChannel"
          :messages="messageStore.chatMessages"
          class="flex-1"
        />
        <VChatBox @send="sendMessage" :channel="selectedChannel" />
      </template>
    </template>
    <template #actions>
      <VSettings
        :profileImage="profileImage"
        :username="loggedUser!.username"
      />
    </template>
    <template #notification>
      <VNotificationList />
    </template>
    <template #chatinfo>
      <template v-if="selectedChannel">
        <VChatInfo
          @color-update="updateColor"
          :images="messageStore.chatImages"
          :channel="selectedChannel"
          :sender="idSender"
          title="channel information"
        />
      </template>
    </template>
    <template #toast>
      <TransitionGroup name="notif" tag="ul" class="flex flex-col gap-2">
        <VToast
          v-for="notif in notifications"
          :key="notif.id"
          :toast-id="notif.id"
          :message="notif.message"
          :title="notif.title"
          @close="closeToast"
        />
      </TransitionGroup>
    </template>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed, onUnmounted, type Ref } from "vue"

import { useUser } from "@/composables/useUser"
import { useFetch } from "@/composables/useFetch"
import { useSocket } from "@/composables/useSocket"

import { useUserStore } from "@/stores/useUserStore"
import { useChannelStore } from "@/stores/useChannelStore"
import { useMessageStore } from "@/stores/useMessageStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useDirectChannelStore } from "@/stores/useDirectChannelStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import VToast from "@/components/molecules/VToast.vue"
import DashboardLayout from "@/components/templates/DashboardLayout.vue"
import VChatList from "@/components/organisms/VChatList.vue"
import VChatTitle from "@/components/organisms/VChatTitle.vue"
import VChatInfo from "@/components/organisms/VChatInfo.vue"
import VChatBox from "@/components/organisms/VChatBox.vue"
import VChatBoxArea from "@/components/organisms/VChatBoxArea.vue"
import ChannelForm from "@/components/organisms/ChannelForm.vue"
import VModal from "@/components/atoms/VModal.vue"
import VChatInvitation from "@/components/organisms/VChatInvitation.vue"
import VInvitationDirect from "@/components/organisms/VInvitationDirect.vue"
import VNotificationList from "@/components/organisms/VNotificationList.vue"

import type { Channel, DirectChannel } from "@/types/Channel"
import { ChannelSchema } from "@/types/Channel"
import type { Notification } from "@/types/Notification"
import { userSchema, type User } from "@/types/User"

const notifAudio = new Audio("./src/assets/slack_sound.mp3")

const notifications = ref<Notification[]>([])

import VSettings from "@/components/organisms/VSettings.vue"

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const userProfileStore = useUserProfileStore()
const channelStore = useChannelStore()
const publicCstore = usePublicChannelStore()
const directCstore = useDirectChannelStore()
const messageStore = useMessageStore()
const channelUserStore = useChannelUserStore()
const unreadMessageStore = useUnreadMessageStore()
const directStore = useDirectChannelStore()
const loggedUser = useUser()

const invitationNotif = notificationStore.getSelectedInvitation()
const multiChannels = channelStore.getMultiChannels()
const singleChannels = channelStore.getSingleChannels()
const directChannels = directCstore.channels

const senderId = ref<string | undefined>(undefined)
const selectedChannel = ref<Channel | DirectChannel | undefined>(undefined)
const activeSocket = ref<WebSocket | undefined>(undefined)
const variant = ref<"MPU" | "MPR" | "SNG" | undefined>()
const onlineSocket = ref<WebSocket | undefined>(undefined)
const invitationModalOpen = ref<boolean>(false)

const idSender = computed(() => {
  return selectedChannel.value?.idUser
})

const privateChannels = computed(() => {
  return singleChannels.value.filter((s) => {
    const users = s.title.split("/")

    return users.some((u) => u === loggedUser?.id)
  })
})

const isChatInfoOpen = ref<boolean>(false)

const toggleChatInfo = () => {
  isChatInfoOpen.value = !isChatInfoOpen.value
}

const isChatListOpen = ref<boolean>(true)

const toggleChatList = () => {
  isChatListOpen.value = !isChatListOpen.value
}

const profileImage = computed(() => {
  const id = userSchema.parse(loggedUser).id
  return userProfileStore.getImage(id)
})

const viewChannel = (id: string) => {
  selectedChannel.value = channelStore.getChannelById(id)
  invitationModalOpen.value = false
}

const closeInvitationModal = () => {
  invitationModalOpen.value = false
}

const openChannel = async (id: string, type: "SNG" | "MPU") => {
  if (type === "SNG") {
    selectedChannel.value = directCstore.getDirectChannel(id)
  } else {
    selectedChannel.value = channelStore.getChannelById(id)
  }
}

const newChannel = (channel: Channel | undefined) => {
  if (channel) {
    channelStore.addNewChannel(channel)
  }
  variant.value = undefined
}

const newDirect = (channel: Channel | undefined) => {
  if (channel) {
    channelStore.addNewChannel(channel)
  }
  variant.value = undefined
}

const updateColor = (color: string) => {
  selectedChannel.value!.color = color
  channelStore.updateChannel(selectedChannel.value!.id, color)
}

const updateArchived = (data: { color: string; archivedAt: string }) => {
  if (selectedChannel.value) {
    selectedChannel.value.color = data.color
    selectedChannel.value.archivedAt = data.archivedAt
    channelStore.updateChannel(
      selectedChannel.value.id,
      data.color,
      data.archivedAt,
    )
  }
}

const sendMessage = async (message: string, img: string | undefined) => {
  if (!channelUserStore.isMember(selectedChannel.value!.id, loggedUser!.id)) {
    const res = await useFetch(`/channels/${selectedChannel.value!.id}/users`, {
      method: "POST",
      body: JSON.stringify({}),
    })
  }
  await messageStore.sendMessage(selectedChannel.value!.id, message, img)
}

const closeToast = (id: string) => {
  notifications.value = [...notifications.value.filter((n) => n.id !== id)]
}

watch(invitationNotif, () => {
  invitationModalOpen.value = true
})

watch(selectedChannel, async (channel) => {
  if (channel) {
    const users = await channelUserStore.getChannelUsers(channel.id)
    await messageStore.getChannelMessages(channel.id)
    const validation = ChannelSchema.safeParse(channel)
    
    if (!validation.success) {
      senderId.value = channel.idUser
    }

    if (activeSocket.value) {
      activeSocket.value.close()
    }
    activeSocket.value = useSocket(
      `/channels/${channel.id}`,
      (data: MessageEvent) => {
        const dataJson = JSON.parse(data.data)
        const newMessage = dataJson.messages

        if (!newMessage) return

        messageStore.chatMessages.push(newMessage)
      },
    )
  }
})

onMounted(async () => {
  await directStore.fetch()
  await userStore.init()
  await userProfileStore.init()
  await publicCstore.fetch()
  await channelStore.init()
  await messageStore.init()
  await unreadMessageStore.init()
  await notificationStore.init()

  onlineSocket.value = useSocket("/sessions", (data: MessageEvent) => {
    const updates = JSON.parse(data.data)

    switch (updates.resourceType) {
      case "CHANNEL_UPDATE": {
        const update = updates.content.channelUpdate
        channelStore.updateChannel(
          updates.content.idChannel,
          update.color,
          update.archivedAt,
        )
        break
      }

      case "CHANNEL": {
        const channel = updates.content.channel
        channelStore.addNewChannel(channel)
        const senderName = userProfileStore.getName(channel.idUser)

        if (channel.channelType !== "SNG") {
          notifications.value.push({
            id: channel.id,
            message: `${senderName} created a new channel`,
            title: "Notification",
          })
          notifAudio.play()
        }
        break
      }

      case "UNREAD": {
        const unreadMessage = updates.content.unread
        const latestMessage = {
          id: unreadMessage.messageId,
          idChannel: unreadMessage.idChannel,
          idUser: unreadMessage.idUser,
          text: unreadMessage.text,
          sentAt: unreadMessage.sentAt,
        }

        if (!selectedChannel.value) {
          return
        }

        messageStore.addNewLatestMessage(latestMessage)
        if (unreadMessage.idChannel !== selectedChannel.value.id) {
          unreadMessageStore.addUnreadMessage(unreadMessage)
        }

        if (
          unreadMessage.senderId !== loggedUser!.id &&
          unreadMessage.channelId !== selectedChannel.value.id &&
          channelUserStore.isMember(unreadMessage.channelId, loggedUser!.id)
        ) {
          const channel = channelStore.getChannelById(unreadMessage.idChannel)
          if (channel) {
            const senderName = userProfileStore.getName(unreadMessage.idSender)
            const title =
              channel.channelType === "SNG"
                ? senderName
                : `${channel.title} (${senderName})`

            notifications.value.push({
              id: unreadMessage.messageId,
              title: title ? title : "",
              message: unreadMessage.text,
            })
            notifAudio.play()
          }
        }
        break
      }

      case "ONLINE_USERS": {
        const onlineUsers = updates.content.onlineUsers
        userStore.updateUserOnlineAt(onlineUsers, "online")
        break
      }

      case "OFFLINE_USER": {
        const offlineUser = updates.content.offlineUser
        userStore.updateUserOnlineAt(offlineUser, "offline")
        break
      }

      case "NEW_USER": {
        const newUser = updates.content.newUser
        userStore.addNewUser(newUser)
        break
      }

      case "NOTIFICATION": {
        const notification = updates.content.notification
        const channel = channelStore.getChannelById(notification.idChannel)
        if (channel?.channelType !== "SNG") {
          notificationStore.addNewNotification(notification)
          notificationStore.setSelectedInvitation(notification)
          notifAudio.play()
        }
        break
      }

      case "NEW_MEMBER": {
        const member = updates.content.member
        channelUserStore.addNewChannelUser(member)
        break
      }

      case "NEW_PROFILE": {
        const profile = updates.content.newProfile
        userProfileStore.addUserProfile(profile)
        break
      }

      case "UPDATE_PROFILE": {
        const profile = updates.content.updateProfile
        userProfileStore.addUserProfile(profile)
        break
      }
    }
  })

  selectedChannel.value =
    privateChannels.value.length > 0
      ? privateChannels.value[0]
      : multiChannels.value[0]
})

onUnmounted(() => {
  onlineSocket.value?.close()
})
</script>

<style scoped>
.notif-move,
.notif-enter-active,
.notif-leave-active {
  transition: all 0.5s ease;
}

.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notif-leave-active {
  position: absolute;
}
</style>
