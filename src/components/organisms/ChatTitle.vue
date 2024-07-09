<template>
  <div
    class="flex items-center justify-start gap-5 border-b border-b-indigo-200 p-5 dark:border-b-slate-800 dark:shadow-none"
  >
    <VIconButton
      v-if="collapse"
      @click="handleToggle"
      class="border bg-gray-100 hover:bg-gray-200 dark:border-slate-800 dark:bg-gray-900 hover:dark:bg-slate-900"
      :invert="true"
      tool-tip="hide chats"
      icon="./src/assets/images/collapse-menu-left.svg"
    />
    <VIconButton
      v-else
      @click="handleToggle"
      class="border bg-gray-100 p-10 hover:bg-gray-200 dark:border-slate-800 dark:bg-gray-900 hover:dark:bg-slate-900"
      :invert="true"
      tool-tip="show chats"
      icon="./src/assets/images/collapse-menu-right.svg"
    />
    <VAvatar
      v-if="!channelT.isPublic"
      :image="channelT.image"
      :status="channelT.status"
      size="xlarge"
    />
    <div
      v-else
      class="flex aspect-square h-12 items-center justify-center rounded-full text-white"
      :class="channelT.color"
    >
      <p>{{ channelT.initials }}</p>
    </div>
    <div>
      <div>
        <p class="font-semibold text-gray-700 dark:text-gray-300">
          {{ channelT.name }}
        </p>
        <template v-if="!channelT.isPublic">
          <p
            class="text-sm capitalize"
            :class="statusClass"
          >
            {{ channelT.status}}
          </p>
        </template>
        <template v-else>
          <p class="text-sm">
            {{ channelT.membersCount }}
          </p>
        </template>
      </div>
    </div>
    <div class="ml-auto flex gap-4">
      <VIconButton
        @click="archiveChannel"
        v-if="!channel.archivedAt"
        :class="channelT.color"
        tool-tip="archive chat"
        icon="./src/assets/images/archive.svg"
      />
      <VIconButton
        @click="emits('toggleInfo')"
        :class="channelT.color"
        tool-tip="show chat details"
        icon="./src/assets/images/info.svg"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from "vue"
  import { storeToRefs } from "pinia"
  import { useUserStore } from "@/stores/useUserStore"
  import { useProfileStore } from "@/stores/useProfileStore"
  import VAvatar from "@/components/molecules/VAvatar.vue"
  import VIconButton from "@/components/molecules/VIconButton.vue"
  import { GROUP_CHANNEL } from "@/types/Channel"
  import { useChannelStore } from "@/stores/useChannelStore"
  import { StatusSchema } from "@/types/User"

  const emits = defineEmits<{
    archive: [value: { color: string; archivedAt: string }]
    toggleInfo: []
    toggleChat: []
  }>()

  const profileStore = useProfileStore()
  const userStore = useUserStore()
  const channelStore = useChannelStore()
  const { channel, channelInitials, userId } = storeToRefs(channelStore)

  const collapse = ref<boolean>(true)

  const name = computed(() => channel.value && 'title' in channel.value ? channel.value.title : profileStore.getName(userId.value))

  const channelT = computed(() => {
    return {
      color: channel.value.color || "bg-gray-600",
      image: profileStore.getImage(userId.value),
      initials: channelInitials.value,
      status: userStore.getStatus(userId.value),
      isPublic: channel.value.channelType === GROUP_CHANNEL || false,
      name: name.value,
      membersCount: channelStore.getChannelUsersCount(channel.value.id)
    }
  })

  const statusClass = {'text-emerald-600': channelT.value.status === StatusSchema.enum.online}

  const archiveChannel = async () => {
    try {
      const archivedAt = new Date().toISOString()
      await channelStore.archiveChannel(archivedAt)
      emits("archive", { color: "", archivedAt })
    } catch (e) {
      const error = e as Error
      console.error(error.message)
    }
  }

  const handleToggle = () => {
    collapse.value = !collapse.value
    emits("toggleChat")
  }
</script>
