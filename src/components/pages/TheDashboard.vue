<template>
  <VModal :is-open="variant === 'SNG'" @close="variant = undefined">
    <VInvitationDirect color="bg-indigo-600" @submit="newDirect" />
  </VModal>
  <VModal :is-open="variant === 'MPU'" @close="variant = undefined">
    <ChannelForm :variant="variant" @submit="newChannel" />
  </VModal>
  <VModal :is-open="invitationModalOpen" @close="closeInvitationModal">
    <VChatInvitation
      :notification="invitationNotif"
      @view="viewChannel"
      @close="closeInvitationModal"
    />
  </VModal>
  <DashboardLayout :toggle-chat="isChatListOpen" :toggle-info="isChatInfoOpen">
    <template #messages>
      <VChatList
        @open="openChannel"
        @click="variant = 'SNG'"
        :items="privateChannels"
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
          :sender="senderId"
        />
        <VChatBoxArea
          :channel="selectedChannel"
          :messages="messages"
          class="flex-1"
        />
        <VChatBox @send="sendMessage" :channel="selectedChannel" />
      </template>
    </template>
    <template #actions>
      <VSettings :profileImage="profileImage" :username="loggedUser.username" />
    </template>
    <template #notification>
      <VNotificationList />
    </template>
    <template #chatinfo>
      <template v-if="selectedChannel">
        <VChatInfo
          @color-update="updateColor"
          :chatMessages="messages"
          :channel="selectedChannel"
          :sender="senderId"
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
import DashboardLayout from "@/components/templates/DashboardLayout.vue";
import VChatList from "@/components/organisms/VChatList.vue";
import VChatTitle from "@/components/organisms/VChatTitle.vue";
import VChatInfo from "@/components/organisms/VChatInfo.vue";
import VChatBox from "@/components/organisms/VChatBox.vue";
import VChatBoxArea from "@/components/organisms/VChatBoxArea.vue";
import ChannelForm from "@/components/organisms/ChannelForm.vue";
import VModal from "@/components/atoms/VModal.vue";
import VInvitationDirect from "@/components/organisms/VInvitationDirect.vue";
import VNotificationList from "@/components/organisms/VNotificationList.vue";
import { useUserStore } from "@/stores/useUserStore";
import { useChannelStore } from "@/stores/useChannelStore";
import { useMessageStore } from "@/stores/useMessageStore";
import { onMounted, ref, watch, computed, onUnmounted } from "vue";
import type { Message } from "@/types/Message.ts";
import type { Channel } from "@/types/Channel.ts";
import type { Notification } from "@/types/Notification";
import type { User } from "@/types/User";
import { useUser } from "@/composables/useUser";
import { useChannelUserStore } from "@/stores/useChannelUserStore";
import { useFetch } from "@/composables/useFetch";
import { useSocket } from "@/composables/useSocket";
import { useNotificationStore } from "@/stores/useNotificationStore";
import VToast from "@/components/molecules/VToast.vue";
import VChatInvitation from "@/components/organisms/VChatInvitation.vue";
import { useUnreadMessageStore } from "@/stores/useUnreadMessageStore";

const notifAudio = new Audio("./src/assets/slack_sound.mp3");

const notifications = ref<Notification[]>([]);

import VSettings from "@/components/organisms/VSettings.vue";

const notificationStore = useNotificationStore();
const userStore = useUserStore();
const channelStore = useChannelStore();
const messageStore = useMessageStore();
const channelUserStore = useChannelUserStore();
const unreadMessageStore = useUnreadMessageStore();
const loggedUser = useUser();
const messages = ref<Message[]>([]);
const senderId = ref<string | undefined>(undefined);

const invitationModalOpen = ref<boolean>(false);

const invitationNotif = notificationStore.getSelectedInvitation();

const multiChannels = channelStore.getMultiChannels();
const singleChannels = channelStore.getSingleChannels();

const privateChannels = computed(() => {
  return singleChannels.value.filter((s) => {
    const users = s.title.split("/");

    return users.some((u) => u === loggedUser?.id);
  });
});

const isChatInfoOpen = ref<boolean>(false);

const toggleChatInfo = () => {
  isChatInfoOpen.value = !isChatInfoOpen.value;
};

const isChatListOpen = ref<boolean>(true);

const toggleChatList = () => {
  isChatListOpen.value = !isChatListOpen.value;
};

const profileImage = computed(() => {
  return userStore.getUserImageById(loggedUser.id);
});

const viewChannel = (id: string) => {
  selectedChannel.value = channelStore.getChannelById(id);
  invitationModalOpen.value = false;
};

const closeInvitationModal = () => {
  invitationModalOpen.value = false;
};

const selectedChannel = ref<Channel | undefined>(undefined);
const activeSocket = ref<WebSocket | undefined>(undefined);

const variant = ref<"MPU" | "MPR" | "SNG" | undefined>();
const onlineSocket = ref<WebSocket | undefined>(undefined);

const openChannel = (id: string) => {
  selectedChannel.value = channelStore.getChannelById(id);
};

const newChannel = (channel: Channel | undefined) => {
  if (channel) {
    channelStore.addNewChannel(channel);
  }
  variant.value = undefined;
};

const newDirect = (channel: Channel | undefined) => {
  if (channel) {
    channelStore.addNewChannel(channel);
  }
  variant.value = undefined;
};

const updateColor = (color: string) => {
  selectedChannel.value.color = color;
  channelStore.updateChannel(selectedChannel.id, color);
};

const updateArchived = (data: { color: string; archivedAt: string }) => {
  selectedChannel.value.color = data.color;
  selectedChannel.value.archivedAt = data.archivedAt;
  channelStore.updateChannel(selectedChannel.id, data.color, data.archivedAt);
};

const sendMessage = async (message: string, img: string | undefined) => {
  if (!channelUserStore.isMember(selectedChannel.value.id, loggedUser.id)) {
    const res = await useFetch(`/channels/${selectedChannel.value.id}/users`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  }
  await messageStore.sendMessage(selectedChannel.value.id, message, img);
};

const closeToast = (id: string) => {
  notifications.value = [...notifications.value.filter((n) => n.id !== id)];
};

watch(invitationNotif, () => {
  invitationModalOpen.value = true;
});

watch(selectedChannel, async (channel) => {
  if (channel) {
    const users = await channelUserStore.getChannelUsers(channel.id);
    
    messages.value = await messageStore.getChannelMessages(channel.id);

    if (channel.channelType === "SNG") {
      const sender = users.find((u: User) => u.userId !== loggedUser.id);
      senderId.value = sender.userId;
    }

    if (activeSocket.value) {
      activeSocket.value.close();
    }
    activeSocket.value = useSocket(
      `/channels/${channel.id}`,
      (data: MessageEvent) => {
        const dataJson = JSON.parse(data.data);
        const newMessage = dataJson.messages;

        if (!newMessage) return;

        messages.value.push(newMessage);
      },
    );
  }
});

onMounted(async () => {
  console.log(invitationNotif.value)
  await userStore.init();
  await channelStore.init();
  await messageStore.init();
  await unreadMessageStore.init();
  await notificationStore.init();

  onlineSocket.value = useSocket("/sessions", (data: MessageEvent) => {
    const updates = JSON.parse(data.data);

    switch (updates.resourceType) {
      case "CHANNEL_UPDATE": {
        const update = updates.content.channelUpdate;
        channelStore.updateChannel(
          updates.content.channelId,
          update.color,
          update.archivedAt,
        );
        break;
      }

      case "CHANNEL": {
        const channel = updates.content.channel;
        channelStore.addNewChannel(channel);
        const senderName = userStore.getUserNameById(channel.userId);

        if (channel.channelType !== "SNG") {
          notifications.value.push({
            id: channel.id,
            message: `${senderName} created a new channel`,
            title: "Notification",
          });
          notifAudio.play();
        }
        break;
      }

      case "UNREAD": {
        const unreadMessage = updates.content.unread;
        const latestMessage = {
          id: unreadMessage.messageId,
          channelId: unreadMessage.channelId,
          userId: unreadMessage.userId,
          text: unreadMessage.text,
          sentAt: unreadMessage.sentAt,
        };

        messageStore.addNewLatestMessage(latestMessage);
        if (unreadMessage.channelId !== selectedChannel.value.id) {
          unreadMessageStore.addUnreadMessage(unreadMessage);
        }

        if (
          unreadMessage.senderId !== loggedUser.id &&
          unreadMessage.channelId !== selectedChannel.value.id &&
          channelUserStore.isMember(unreadMessage.channelId, loggedUser.id)
        ) {
          const channel = channelStore.getChannelById(unreadMessage.channelId);
          if (channel) {
            const senderName = userStore.getUserNameById(
              unreadMessage.senderId,
            );
            const title =
              channel.channelType === "SNG"
                ? senderName
                : `${channel.title} (${senderName})`;

            notifications.value.push({
              id: unreadMessage.messageId,
              message: unreadMessage.text,
              title: title,
            });
            notifAudio.play();
          }
        }
        break;
      }

      case "ONLINE_USERS": {
        const onlineUsers = updates.content.onlineUsers;
        userStore.updateUserOnlineAt(onlineUsers, "online");
        break;
      }

      case "OFFLINE_USER": {
        const offlineUser = updates.content.offlineUser;
        userStore.updateUserOnlineAt(offlineUser, "offline");
        break;
      }

      case "NEW_USER": {
        const newUser = updates.content.newUser;
        userStore.addNewUser(newUser);
        break;
      }

      case "NOTIFICATION": {
        const notification = updates.content.notification;
        const channel = channelStore.getChannelById(notification.channelId);
        if (channel.channelType !== "SNG") {
          notificationStore.addNewNotification(notification);
          notificationStore.setSelectedInvitation(notification);
          notifAudio.play();
        }
        break;
      }

      case "NEW_MEMBER": {
        const member = updates.content.member;
        channelUserStore.addNewChannelUser(member);
        break;
      }

      case "NEW_PROFILE": {
        const profile = updates.content.newProfile;
        userStore.addUserProfile(profile.userId, profile);
        break;
      }

      case "UPDATE_PROFILE": {
        const profile = updates.content.updateProfile;
        userStore.addUserProfile(profile.userId, profile);
        break;
      }
    }
  });

  selectedChannel.value =
    privateChannels.value.length > 0
      ? privateChannels.value[0]
      : multiChannels.value[0];
});

onUnmounted(() => {
  onlineSocket.value.close();
});
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
