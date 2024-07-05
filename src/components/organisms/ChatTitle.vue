<template>
  <div
    class="flex items-center justify-start gap-5 border-b border-b-indigo-200 p-5 dark:border-b-slate-800 dark:shadow-none"
  >
    <VIconButton
      v-if="collapse"
      @click="emits('toggleChat')"
      class="border bg-gray-100 hover:bg-gray-200 dark:border-slate-800 dark:bg-gray-900 hover:dark:bg-slate-900"
      :invert="true"
      tool-tip="hide chats"
      icon="./src/assets/images/collapse-menu-left.svg"
    />
    <VIconButton
      v-else
      @click="emits('toggleChat')"
      class="border bg-gray-100 p-10 hover:bg-gray-200 dark:border-slate-800 dark:bg-gray-900 hover:dark:bg-slate-900"
      :invert="true"
      tool-tip="show chats"
      icon="./src/assets/images/collapse-menu-right.svg"
    />
    <VAvatar
      v-if="channelType === 'SNG' && typeof sender == 'string'"
      :image="profileStore.getImage(sender)"
      :status="userStore.getStatus(sender)"
      size="xlarge"
    />
    <div
      v-else
      class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
      :class="curColorTheme"
    >
      <p>{{ channelAbbr }}</p>
    </div>
    <div>
      <div>
        <template v-if="channelType === 'SNG'">
          <p class="font-semibold text-gray-700 dark:text-gray-300">
            {{ sender ? profileStore.getName(sender) : "" }}
          </p>
          <p
            class="text-sm capitalize"
            :class="{
              'text-emerald-600': userStore.getStatus(sender) === 'online',
            }"
          >
            {{ sender && userStore.getStatus(sender) }}
          </p>
        </template>
        <template v-else>
          <p class="font-semibold text-gray-700 dark:text-gray-300">
            {{ publicChannelStore.getTitle(channel.id) }}
          </p>
          <p class="text-sm">
            {{ channelStore.getChannelUsersCount(channel.id) }}
          </p>
        </template>
      </div>
    </div>
    <div class="ml-auto flex gap-4">
      <VIconButton
        @click="archiveChannel"
        v-if="sender && channel.idUser === sender && !channel.archivedAt"
        :class="curColorTheme"
        tool-tip="archive chat"
        icon="./src/assets/images/archive.svg"
      />
      <VIconButton
        @click="emits('toggleInfo')"
        :class="curColorTheme"
        tool-tip="show chat details"
        icon="./src/assets/images/info.svg"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useUserStore } from "@/stores/useUserStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"

import VAvatar from "@/components/molecules/VAvatar.vue"
import VIconButton from "@/components/molecules/VIconButton.vue"

import type { Channel, DirectChannel } from "@/types/Channel"
import { ChannelSchema } from "@/types/Channel"
import { useChannelStore } from "@/stores/useChannelStore"

const props = defineProps<{
  channel: Channel | DirectChannel
  sender?: string
  collapse: boolean
}>()

const emits = defineEmits<{
  archive: [value: { color: string; archivedAt: string }]
  toggleInfo: []
  toggleChat: []
}>()

const profileStore = useUserProfileStore()
const userStore = useUserStore()
const publicChannelStore = usePublicChannelStore()
const channelStore = useChannelStore()

const channelAbbr = computed(() => {
  const abbrValidation = ChannelSchema.safeParse(props.channel)
  if (abbrValidation.success) {
    return abbrValidation.data.title.slice(0, 1)
  }
})

const channelType = computed(() => {
  const typeValidation = ChannelSchema.safeParse(props.channel)
  return typeValidation.success ? "MPU" : "SNG"
})

const curColorTheme = computed(() => {
  return props.channel.color ? props.channel.color : "bg-slate-800"
})

const archiveChannel = async () => {
  try {
    const archivedAt = new Date().toISOString()
    await channelStore.archiveChannel(props.channel, archivedAt)
    emits("archive", { color: "", archivedAt })
  } catch (e) {
    const error = e as Error
    console.error(error.message)
  }
}
</script>
