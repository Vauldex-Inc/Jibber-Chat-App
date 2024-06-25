<template>
  <div class="relative">
    <VIconButton
      icon="./src/assets/images/notification-bell.svg"
      :invert="true"
      :rounded="true"
      @click="toggleNotifications"
    />
    <span
      v-if="unSeenCount > 0"
      class="absolute bottom-0 right-0 rounded-full bg-red-500 px-1 py-0.5 text-xs text-white"
    >
      {{ unSeenCount }}
    </span>
    <div
      v-if="displayNotification"
      @mouseleave="displayNotification = false"
      class="absolute bottom-0 left-2 z-30 translate-y-full rounded-md bg-white px-2 py-5 shadow-xl dark:bg-slate-800"
    >
      <ul
        v-if="notificationsCopy.length > 0"
        @mouseleave="toggleNotifications"
        class="max-h-80 w-[28rem] divide-y overflow-y-scroll dark:divide-slate-700"
      >
        <VNotificationListItem
          v-for="notification in notificationsCopy"
          :key="notification.id"
          :notification="notification"
          @close="toggleNotifications"
        />
      </ul>
      <div
        v-else
        class="mx-3 max-h-80 w-[28rem] rounded-md bg-gray-100 py-5 text-center dark:bg-slate-700"
      >
        No Notifications
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { useNotificationStore } from "@/stores/useNotificationStore";
import { useChannelStore } from "@/stores/useChannelStore";

import VIconButton from "@/components/atoms/VIconButton.vue";
import VNotificationListItem from "@/components/organisms/VNotificationListItem.vue";

const notificationStore = useNotificationStore();
const channelStore = useChannelStore();
const notifications = notificationStore.getNotifications();
const displayNotification = ref<boolean>(false);

const unSeenCount = computed(() => {
  if (notificationsCopy.value !== undefined) {
    return notificationsCopy.value.filter((n) => n.seenAt === undefined).length;
  } else {
    return 0
  }
});

const notificationsCopy = computed(() => {
  if (notifications.value !== undefined) {
    return notifications.value
      .filter((n) => {
        const channel = channelStore.getChannelById(n.channelId);
        if (channel !== undefined)
          return channel.channelType !== "SNG";
      })
      .reverse();
  } else {
    return []
  }
});

const toggleNotifications = () => {
  displayNotification.value = !displayNotification.value;
};
</script>
