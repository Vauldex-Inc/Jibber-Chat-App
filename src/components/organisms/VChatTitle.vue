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
      class="border bg-gray-100 hover:bg-gray-200 dark:border-slate-800 dark:bg-gray-900 hover:dark:bg-slate-900"
      :invert="true"
      tool-tip="show chats"
      icon="./src/assets/images/collapse-menu-right.svg"
    />
    <VAvatar
      v-if="channel.channelType === 'SNG' && typeof sender == 'string'"
      :image="userStore.senderProfile(sender)"
      :status="userStore.senderStatus(sender)"
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
        <template v-if="channel.channelType === 'SNG'">
          <p class="font-semibold text-gray-700 dark:text-gray-300">
            {{ sender ? userStore.senderName(sender) : "" }}
          </p>
          <p
            class="text-sm capitalize"
            :class="{
              'text-emerald-600': userStore.senderStatus(sender) === 'online',
            }"
          >
            {{ sender && userStore.senderStatus(sender) }}
          </p>
        </template>
        <template v-else>
          <p class="font-semibold text-gray-700 dark:text-gray-300">
            {{ channel.title }}
          </p>
          <p class="text-sm">
            {{ channelUserStore.getChannelUsersCount(channel.id) }}
          </p>
        </template>
      </div>
    </div>
    <div class="ml-auto flex gap-4">
      <VIconButton
        @click="archiveChannel"
        v-if="sender && channel.userId === sender && !channel.archivedAt"
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
import { useFetch } from "@/composables/useFetch"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import VAvatar from "@/components/molecules/VAvatar.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import type { Channel } from "@/types/Channel"

const props = defineProps<{
  channel: Channel
  sender?: string
  collapse: boolean
}>()

const emits = defineEmits<{
  archive: [value: { color: string | undefined; archivedAt: string }]
  toggleInfo: []
  toggleChat: []
}>()

const userStore = useUserStore()
const channelUserStore = useChannelUserStore()

const channelAbbr = computed(() => {
  return props.channel.title.slice(0, 1)
})

const curColorTheme = computed(() => {
  return props.channel.color ? props.channel.color : "bg-slate-800"
})

const archiveChannel = async () => {
  const archivedAt = new Date().toISOString()

  const res = await useFetch(`/channels/${props.channel.id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: props.channel.title,
      channelType: props.channel.channelType,
      color: undefined,
      archivedAt: archivedAt,
    }),
  })

  if (res.status === 200) {
    emits("archive", { color: undefined, archivedAt })
  }
}
</script>
