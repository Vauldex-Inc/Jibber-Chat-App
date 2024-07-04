<template>
  <div class="details">
    <header>
      <VAvatar :status="status" size="xlarge"  @click="modal('profile')" />
      <h4 class="font-semibold">
        {{ name }}
      </h4>
    </header>
    <div v-if="channel.archivedAt" class="flex items-center justify-center gap-4">
      <template v-for="opt, index in options" :key="opt.key">
        <div
          v-if="checkPermissions(opt.permission)"
          class="group flex flex-col items-center justify-center gap-2"
        >
          <VIconButton
            :icon="opt.icon"
            :invert="true"
            class="border-2 border-indigo-200 bg-indigo-100 group-hover:border-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-800 dark:group-hover:bg-slate-900"
            @click="modal(opt.key)"
          />
          <p class="text-sm text-gray-600 dark:text-slate-400">
            {{ opt.title }}
          </p>
        </div>
      </template>

      <VModal :is-open="open">
        <!-- Add condition -->
        <InvitationPublic
          :color="channel.color"
          :id-channel="channel.id"
          @action="(idUser) => inviteMember(channel.id, idUser)"
        />
        <!-- Add condition -->
        <ChatColorSelector @color="channel.changeTheme" />
        <!-- Add condition -->
        <VProfileForm />
      </VModal>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { z } from "zod"
  import { useUserStore } from "@/stores/useUserStore"
  import { useUserProfileStore } from "@/stores/useUserProfileStore"
  import { useChannelStore } from "@/stores/useChannelStore"
  import { ChannelVariantEnum } from "@/types/Channel"

  const { getStatus, inviteMember } = useUserStore()
  const { getName } = useUserProfileStore()
  const channel = useChannelStore()
  const open = ref(false)
  const options = ref({
    member: {
      key: 'member',
      title: 'Member',
      icon: './src/assets/images/add.svg',
      permission: [ChannelVariantEnum.DIRECT_CHANNEL]
    },
    theme: {
      key: 'theme',
      title: 'Theme',
      icon: './src/assets/images/theme.svg',
      permission: [ChannelVariantEnum.DIRECT_CHANNEL, ChannelVariantEnum.GROUP_CHANNEL]
    }
  })

  // Refactor this in the future
  const name = computed(() => channel && 'title' in channel ? channel.title : getName(channel.idUser))
  const status = computed(() => getStatus(channel.idUser))

  const checkPermissions = (type: ChannelVariantEnum): boolean => ChannelVariantEnum.parse(type)

  const modal = (key: string) => {
    switch(key) {
      case 'member': // open add member modal
      case 'theme': // open add theme modal
      case 'profile': // open view profile
    }
  }
</script>
