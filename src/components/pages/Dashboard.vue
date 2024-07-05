<template>
  <!-- Refactor this -->
  <!-- <VModal 
    :is-open="publicCstore.variant === DIRECT_CHANNEL" 
    @close="publicCstore.variant = undefined"
  >
    <InvitationDirect color="bg-indigo-600" @submit="newDirect" />
  </VModal> -->
  <VModal 
    :is-open="publicCstore.variant === GROUP_CHANNEL" 
    @close="publicCstore.variant = undefined"
  >
    <AddChannel/>
  </VModal>
  <VModal :is-open="invitationModalOpen" @close="closeInvitationModal">
    <InvitationCard
      :notification="invitationNotif!"
      :name="userProfileStore.getName(invitationNotif?.idSender!)"
      @view="viewChannel"
      @close="closeInvitationModal"
    />
  </VModal>
  <!-- End of Refactor this -->




  <TheChat :toggle-info="toggleChatInfo()" :toggle-chat="toggleChatList()">
    <template #chatbox>
      <template v-if="channelStore.channel">
        <ChatTitle
          :collapse="isChatListOpen"
          @toggle-chat="toggleChatList"
          @toggle-info="toggleChatInfo"
          @archive="updateArchived"
          :channel="channelStore.channel"
          :sender="idSender"
        />
        <ChatBoxArea
          :channel="channelStore.channel"
          :messages="messageStore.chatMessages"
          class="flex-1"
        />
        <ChatBox @send="sendMessage" :channel="channelStore.channel" />
      </template>
    </template>

    <template #left>
      <TheChatList>
        <template #actions>
          <Settings :username="loggedUser!.username" :profileImage="profileImage" />
        </template>

        <template #notification>
          <NotificationList />
        </template>

        <template #messages>
          <DirectChannels />
        </template>
        <template #messages>
          <VChatList
            @open="openChannel"
            @click="publicCstore.variant = DIRECT_CHANNEL"
            :items="directChannels"
            class="h-3/6"
            title="messages"
          />
        </template>
        <template #channels>
          <PublicChannels />
        </template>
      </TheChatList>
    </template>


    <template #right>
      <TheChannelInformation>
        <template #details>
          <ChatDetails />
        </template>

        <template #members>
          <ChatMembers />
        </template>

        <template #images>
          <ChatImages />
        </template>
      </TheChannelInformation>
    </template>
  </TheChat>

  <TransitionGroup name="notif" tag="ul" class="flex flex-col gap-2 absolute right-0 top-0 z-40">
    <VToast
      v-for="n in notifications"
      :key="n.id"
      :toast-id="n.id"
      :message="n.message"
      :title="n.title"
      @close="onCloseToast"
    />
  </TransitionGroup>

<!--   <TheDashboard :toggle-chat="isChatListOpen" :toggle-info="isChatInfoOpen">
    <template #messages>
      <VChatList
        @open="openChannel"
        @click="publicCstore.variant = DIRECT_CHANNEL"
        :items="directChannels"
        class="h-3/6"
        title="messages"
      />
    </template>
    <template #channels>
      <VChatList
        @open="openChannel"
        @click="publicCstore.variant = GROUP_CHANNEL"
        :items="multiChannels"
        class="h-2/6"
        title="channels"
      />
    </template>
    <template #chatbox>
      <template v-if="selectedChannel">
        <ChatTitle
          :collapse="isChatListOpen"
          @toggle-chat="toggleChatList"
          @toggle-info="toggleChatInfo"
          @archive="updateArchived"
          :channel="selectedChannel"
          :sender="idSender"
        />
        <ChatBoxArea
          :channel="selectedChannel"
          :messages="messageStore.chatMessages"
          class="flex-1"
        />
        <ChatBox @send="sendMessage" :channel="selectedChannel" />
      </template>
    </template>
    <template #actions>
      <Settings
        :profileImage="profileImage"
        :username="loggedUser!.username"
      />
    </template>
    <template #notification>
      <NotificationList />
    </template>
    <template #chatinfo>
      <template v-if="selectedChannel">
        <ChatInfo
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
          @close="onCloseToast"
        />
      </TransitionGroup>
    </template>
  </TheDashboard> -->
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  watch,
  computed,
  onUnmounted
} from "vue"

import { useUser } from "@/composables/useUser"
import { useFetch } from "@/composables/useFetch"
import { useSocket } from "@/composables/useSocket"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelStore } from "@/stores/useChannelStore"
import { useMessageStore } from "@/stores/useMessageStore"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useDirectChannelStore } from "@/stores/useDirectChannelStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import DirectChannels from "../organisms/DirectChannels.vue"
import TheChatList from "../templates/TheChatList.vue"
import ChatMembers from "../organisms/ChatMembers.vue"
import ChatImages from "../organisms/ChatImages.vue"
import TheChannelInformation from "../templates/TheChannelInformation.vue"
import TheChat from "../templates/TheChat.vue"
import VToast from "@/components/molecules/VToast.vue"
import ChatTitle from "@/components/organisms/ChatTitle.vue"
import ChatBox from "@/components/organisms/ChatBox.vue"
import ChatBoxArea from "@/components/organisms/ChatBoxArea.vue"
import VModal from "@/components/atoms/VModal.vue"
import InvitationCard from "@/components/organisms/InvitationCard.vue"
import NotificationList from "@/components/organisms/NotificationList.vue"
import Settings from "@/components/organisms/Settings.vue"
import AddChannel from "@/components/organisms/AddChannel.vue"
import PublicChannels from "@/components/organisms/PublicChannels.vue"
import TheChannelInformation from "@/components/templates/TheChannelInformation.vue"
import TheChat from "@/components/templates/TheChat.vue"
import TheChatList from "@/components/templates/TheChatList.vue"
import VChatList from "../organisms/VChatList.vue"
import type { Channel, DirectChannel, PublicChannel } from "@/types/Channel"
import { ChannelSchema, DIRECT_CHANNEL, DirectChannelSchema, GROUP_CHANNEL, PublicChannelSchema } from "@/types/Channel"
import type { Notification } from "@/types/Notification"
import { UserSchema } from "@/types/User"
import ChatDetails from "../organisms/ChatDetails.vue"
import { storeToRefs } from "pinia"

const notifAudio = new Audio("./src/assets/slack_sound.mp3")

const notifications = ref<Notification[]>([])

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const userProfileStore = useUserProfileStore()
const channelStore = useChannelStore()
const { channel } = storeToRefs(channelStore)
const publicCstore = usePublicChannelStore()
const directCstore = useDirectChannelStore()
const messageStore = useMessageStore()
const unreadMessageStore = useUnreadMessageStore()
const directStore = useDirectChannelStore()
const loggedUser = useUser()

const invitationNotif = notificationStore.getSelectedInvitation()
const multiChannels = publicCstore.channels
const directChannels = directCstore.channels

const senderId = ref<string | undefined>(undefined)
const selectedChannel = ref<Channel | DirectChannel | undefined>(undefined)
const activeSocket = ref<WebSocket | undefined>(undefined)
const onlineSocket = ref<WebSocket | undefined>(undefined)
const invitationModalOpen = ref<boolean>(false)

const idSender = computed(() => {
  const validation = DirectChannelSchema.safeParse(channelStore.channel)
  if (validation.success) {
    if (loggedUser?.id === validation.data.idUser) {
      return validation.data.idReceiver
    } else {
      return validation.data.idUser
    }
  } else {
    return channelStore.channel.idUser
  }
})

const privateChannels = computed(() => {
  return singleChannels.value.filter((s) => {
    const users = s.title.split("/")

    return users.some((u) => u === loggedUser?.id)
  })
})

const isChatInfoOpen = ref<boolean>(true) // switch to false after

const toggleChatInfo = () => {
  isChatInfoOpen.value = !isChatInfoOpen.value
  return isChatInfoOpen.value
}

const isChatListOpen = ref<boolean>(true)

const toggleChatList = () => {
  isChatListOpen.value = !isChatListOpen.value
  return isChatInfoOpen.value
}

const profileImage = computed(() => {
  const userValidation = UserSchema.safeParse(loggedUser)
  if (userValidation.success) {
    return userProfileStore.getImage(userValidation.data.id)
  }
})

const viewChannel = (id: string) => {
  const validation = PublicChannelSchema.safeParse(publicCstore.getChannelById(id))
  if (validation.success) {
    channelStore.set(validation.data)
  } else {
    channelStore.set(channelStore.channel)
  }
  invitationModalOpen.value = false
}

const closeInvitationModal = () => {
  invitationModalOpen.value = false
}

const openChannel = async (channel: PublicChannel | DirectChannel) => {
  channelStore.set(channel)
}

// const newDirect = (channel: DirectChannel | undefined) => {
//   if (channel) {
//     const channelValidation = DirectChannelSchema.safeParse(channel)
//     if (channelValidation.success) {
//       directCstore.add(channel)
//     } else {
//       throw new Error("Failed to create channel")
//     }
//   }
// }

const updateArchived = (data: { color: string; archivedAt: string }) => {
  if (channelStore.channel) {
    channelStore.channel.color = data.color
    channelStore.channel.archivedAt = data.archivedAt
    channelStore.changeTheme(data.color)
  }
}

const sendMessage = async (message: string, img: string | undefined) => {
  if (!channelUserStore.isMember(channelStore.channel.id, loggedUser!.id)) {
    await useFetch(`/channels/${channelStore.channel.id}/users`, {
      method: "POST",
      body: JSON.stringify({}),
    })
  }
  await messageStore.sendMessage(channelStore.channel.id, message, img)
}

const onCloseToast = (id: string) => {
  notifications.value = [...notifications.value.filter((n) => n.id !== id)]
}

watch(invitationNotif, () => {
  invitationModalOpen.value = true
})

watch(channel, async (channel) => {
  if (channel) {
    const users = await channelStore.getChannelUsers(channel.id)
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
  await messageStore.init()
  await unreadMessageStore.init()
  await notificationStore.init()

  onlineSocket.value = useSocket("/sessions", (data: MessageEvent) => {
    const updates = JSON.parse(data.data)

    switch (updates.resourceType) {
      case "CHANNEL_UPDATE": {
        const update = updates.content.channelUpdate
        channelStore.changeTheme(update.color)
        break
      }

      case "CHANNEL": {
        const channel = updates.content.channel
        const channelValidation = ChannelSchema.safeParse(channel)
        if (channelValidation.success) {
          publicCstore.add(channelValidation.data) //change to add
          publicCstore.add(channelValidation.data) //change to add
          const senderName = userProfileStore.getName(channelValidation.data.idUser)

          notifications.value.push({
            id: channel.id,
            message: `${senderName} created a new channel`,
            title: "Notification",
          })
          notifAudio.play()
        } else {
          directCstore.add(channel)
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

        if (channelStore.channel) {
          return
        }

        messageStore.addNewLatestMessage(latestMessage)
        const validation = ChannelSchema.safeParse(channelStore.channel)

        if (validation.success) {
          if (unreadMessage.idChannel !== validation.data.id) {
          unreadMessageStore.addUnreadMessage(unreadMessage)
        }
          if (
            unreadMessage.idSender !== loggedUser!.id &&
            unreadMessage.idChannel !== validation.data.id &&
            channelUserStore.isMember(unreadMessage.idChannel, loggedUser!.id)
          ) {
            const channel = directCstore.getDirectChannel(unreadMessage.idChannel)
            const validation = DirectChannelSchema.safeParse(channel)
            if (channel) {
              const senderName = userProfileStore.getName(unreadMessage.idSender)
              const title =
                validation.success
                  ? senderName
                  : `${channel.title} (${senderName})`

              notifications.value.push({
                id: unreadMessage.messageId,
                title: title ? title : "",
                message: unreadMessage.text,
              })
            }
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
        const channel = publicCstore.getChannelById(notification.idChannel)
        const validation = PublicChannelSchema.safeParse(channel)
        if (validation.success) {
          notificationStore.addNewNotification(notification)
          notificationStore.setSelectedInvitation(notification)
          notifAudio.play()
        }
        break
      }

      case "NEW_MEMBER": {
        const member = updates.content.member
        channelStore.addNewChannelUser(member)
        break
      }

      case "NEW_PROFILE": {
        const profile = updates.content.newProfile
        userProfileStore.addUserProfile(profile)
        break
      }

      case "UPDATE_PROFILE": {
        const profile = updates.content.updateProfile
        userProfileStore.updateProfile(profile)
        break
      }
    }
  })

  channelStore.set(
    directChannels.value.length > 0
      ? directChannels.value[0]
      : multiChannels.value[0]
    )
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
