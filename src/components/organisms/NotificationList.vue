<template>
  <div class="relative">
    <VIconButton
      icon="./src/assets/images/notification-bell.svg"
      :invert="true"
      :rounded="true"
      size="medium"
      @click="toggleNotifications"
    />
    <span
      v-if="unSeenCount"
      class="absolute bottom-0 right-0 rounded-full bg-red-500 px-1 py-0.5 text-xs text-white"
    >
      {{ unSeenCount }}
    </span>
    <div
      v-if="displayNotification"
      class="absolute bottom-0 left-2 z-30 translate-y-full rounded-md bg-white px-2 py-5 shadow-xl dark:bg-slate-800"
      @mouseleave="displayNotification = false"
    >
      <ul
        v-if="notificationsCopy?.length !== 0"
        class="max-h-80 w-[28rem] divide-y overflow-y-scroll dark:divide-slate-700"
        @mouseleave="toggleNotifications"
      >
        <NotificationListItem
          v-for="notification in notificationsCopy"
          :key="notification.id"
          :invitation="notification"
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
import { ref, computed } from "vue"
import { useUser } from "@/composables/useUser"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useChannelStore } from "@/stores/useChannelStore"
import VIconButton from "@/components/molecules/VIconButton.vue"
import NotificationListItem from "@/components/organisms/NotificationListItem.vue"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { PublicChannelSchema } from "@/types/Channel"

const notificationStore = useNotificationStore()
const notifications = notificationStore.getNotifications()
const publicCstore = usePublicChannelStore()
const loggedUser = useUser()

const displayNotification = ref<boolean>(false)

const unSeenCount = computed(() => {
  return notificationsCopy.value.filter((n) => n.seenAt === undefined).length
})

const notificationsCopy = computed(() => {
  return notifications.value
    .filter((n) => {
      const channel = publicCstore.channels
      const validation = PublicChannelSchema.safeParse(channel)
      return validation.success && n.idUser === loggedUser?.id
    })
    .reverse()
})

const toggleNotifications = () => {
  displayNotification.value = !displayNotification.value
}
</script>
