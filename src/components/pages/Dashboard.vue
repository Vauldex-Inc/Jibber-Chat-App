<template>
  <TheChat>
    <template #chatbox="props">
      <template v-if="channel">
        <ChatTitle
          @toggle-chat="props.toggleLeft"
          @toggle-info="props.toggleRight"
          @archive="updateArchived"
          :channel="channel"
        />
        <ChatBoxArea
          :channel="channel"
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
          <ChatMembers v-if="isPublic" />
        </template>

        <template #images>
          <ChatImages />
        </template>
      </TheChannelInformation>
    </template>
  </TheChat>

  <TransitionGroup name="notif" tag="ul" class="flex flex-col gap-2 absolute right-0 top-0 z-40">
    <VToast
      v-for="n in toastNotifications"
      :key="n.id"
      :toast-id="n.id"
      :message="n.message"
      :title="n.title"
      @close="onCloseToast"
    />
  </TransitionGroup>
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  watch,
  computed,
  onUnmounted
} from "vue"
import { storeToRefs } from "pinia"
import axios, { AxiosError } from "axios"
import { useUser } from "@/composables/useUser"
import { useSocket } from "@/composables/useSocket"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelStore } from "@/stores/useChannelStore"
import { useMessageStore } from "@/stores/useMessageStore"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore"
import { useDirectChannelStore } from "@/stores/useDirectChannelStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { useProfileStore } from "@/stores/useProfileStore"
import DirectChannels from "@/components/organisms/DirectChannels.vue"
import TheChatList from "@/components/templates/TheChatList.vue"
import ChatMembers from "@/components/organisms/ChatMembers.vue"
import ChatImages from "@/components/organisms/ChatImages.vue"
import TheChannelInformation from "@/components/templates/TheChannelInformation.vue"
import TheChat from "@/components/templates/TheChat.vue"
import VToast from "@/components/molecules/VToast.vue"
import ChatTitle from "@/components/organisms/ChatTitle.vue"
import ChatBox from "@/components/organisms/ChatBox.vue"
import ChatBoxArea from "@/components/organisms/ChatBoxArea.vue"
import NotificationList from "@/components/organisms/NotificationList.vue"
import Settings from "@/components/organisms/Settings.vue"
import PublicChannels from "@/components/organisms/PublicChannels.vue"
import ChatDetails from "@/components/organisms/ChatDetails.vue"
import { ChannelSchema, DirectChannelSchema, GROUP_CHANNEL, PublicChannelSchema } from "@/types/Channel"
import { InvitationSchema, type Notification } from "@/types/Notification"
import { UserSchema } from "@/types/User"

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const userProfileStore = useProfileStore()
const channelStore = useChannelStore()
const { channel } = storeToRefs(channelStore)
const publicCstore = usePublicChannelStore()
const directCstore = useDirectChannelStore()
const messageStore = useMessageStore()
const unreadMessageStore = useUnreadMessageStore()
const directStore = useDirectChannelStore()
const loggedUser = useUser()
const notifAudio = new Audio("./src/assets/slack_sound.mp3")

const multiChannels = publicCstore.channels
const directChannels = directCstore.channels

const senderId = ref<string | undefined>(undefined)
const activeSocket = ref<WebSocket | undefined>(undefined)
const onlineSocket = ref<WebSocket | undefined>(undefined)
const toastNotifications = ref<Notification[]>([])

const isPublic = computed(() => channel.value.channelType === GROUP_CHANNEL)

const profileImage = computed(() => {
  const userValidation = UserSchema.safeParse(loggedUser)
  if (userValidation.success) {
    return userProfileStore.getImage(userValidation.data.id)
  }
})

const updateArchived = (data: { color: string; archivedAt: string }) => {
  if (channelStore.channel) {
    channelStore.channel.color = data.color
    channelStore.channel.archivedAt = data.archivedAt
  }
}

const sendMessage = async (message: string, img: string | undefined) => {
  try {
    if (!channelStore.isMember(channelStore.channel.id, loggedUser!.id)) {
      await axios.post(`/channels/${channelStore.channel.id}/users`, {})
    }
    await messageStore.sendMessage(channelStore.channel.id, message, img)
  } catch (e) {
    const error = e as AxiosError
    console.error(error.message)
  }
}

const onCloseToast = (id: string) => {
  toastNotifications.value = [...toastNotifications.value.filter((n) => n.id !== id)]
}

watch(channel, async (channel) => {
  if (channel) {
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
    await userStore.fetch()
    await userProfileStore.fetch()
    await publicCstore.fetch()
    await messageStore.fetch()
    await unreadMessageStore.fetch()
    await notificationStore.fetch()

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
            const senderName = userProfileStore.getName(channelValidation.data.idUser)

            toastNotifications.value.push({
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

        case "CHANNEL_INVITE": {
          const notification = updates.content.channelInvite
          const validation = InvitationSchema.safeParse(notification)
          
          if (validation.success) {
            notificationStore.addNewNotification(validation.data)
          }
      
          break
        }

        case "UNREAD": {
          const unreadMessage = updates.content.unread
          const latestMessage = {
            id: unreadMessage.idMessage,
            idChannel: unreadMessage.idChannel,
            idUser: unreadMessage.idUser,
            text: unreadMessage.text,
            sentAt: unreadMessage.sentAt,
          }

          if (!channelStore.channel) {
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
              channelStore.isMember(unreadMessage.idChannel, loggedUser!.id)
            ) {
              const channel = directCstore.getDirectChannel(unreadMessage.idChannel)
              const validation = DirectChannelSchema.safeParse(channel)
              if (channel) {
                const senderName = userProfileStore.getName(unreadMessage.idSender)
                const title =
                  validation.success
                    ? senderName
                    : `${channel.title} (${senderName})`

                toastNotifications.value.push({
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
