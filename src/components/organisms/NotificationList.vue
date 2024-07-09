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
        v-if="isNotEmpty"
        class="max-h-80 w-[28rem] divide-y overflow-y-scroll dark:divide-slate-700"
        @mouseleave="toggleNotifications"
      >
        <NotificationListItem
          v-for="notification in notificationsCopy"
          :key="notification.id"
          :invitation="notification"
          @close="toggleNotifications"
          @click="open = true"
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
  <VModal :is-open="open" @close="open = false">
    <InvitationCard
      :notification="invitationNotif!"
      :name="senderName"
      @view="viewChannel"
      @close="open = false"
    />
  </VModal>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue"
  import { useUser } from "@/composables/useUser"
  import { useNotificationStore } from "@/stores/useNotificationStore"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VIconButton from "@/components/molecules/VIconButton.vue"
  import NotificationListItem from "@/components/organisms/NotificationListItem.vue"
  import InvitationCard from "@/components/organisms/InvitationCard.vue"
  import VModal from "@/components/molecules/VModal.vue"
  import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
  import { useProfileStore } from "@/stores/useProfileStore"

  const notificationStore = useNotificationStore()
  const notifications = notificationStore.getNotifications()
  const { getName } = useProfileStore()
  const channelStore = useChannelStore()
  const publicStore = usePublicChannelStore()
  const loggedUser = useUser()
  const invitationNotif = notificationStore.getSelectedInvitation()

  const displayNotification = ref<boolean>(false)
  const open = ref<boolean>(false)

  const unSeenCount = computed(() => {
    return notificationsCopy.value.filter((n) => n.seenAt === undefined).length
  })

  const notificationsCopy = computed(() => {
    return notifications.value
      .filter((n) => {
        const channel = publicStore.getChannelById(n.idChannel)
        return channel?.channelType !== "SNG" && n.idUser === loggedUser?.id
      })
      .reverse()
  })

  const isNotEmpty = computed(() => notificationsCopy.value.length > 0)

  const senderName = computed(() => getName(invitationNotif.value?.idSender!))

  const toggleNotifications = () => {
    displayNotification.value = !displayNotification.value
  }

  const viewChannel = (id: string) => {
    const foundChannel = channelStore.getOnNotifChannel(id)

    if (foundChannel) {
      channelStore.set(foundChannel)
    } else {
      console.error("No Channel Found")
    }
    open.value = false
  }
</script>
