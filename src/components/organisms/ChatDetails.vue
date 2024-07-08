<template>
  <div class="flex flex-col items-center justify-center gap-5 px-5 pb-5 pt-16">
    <header class="text-center">
      <VAvatar 
        v-if="!transformedChannel.isPublic" 
        :status="transformedChannel.status" 
        size="xlarge"  
        @click="modal('profile')" 
      />
      <div
        v-else
        class="flex aspect-square h-12 items-center justify-center mx-auto rounded-full text-white"
        :class="transformedChannel.color"
      >
        <p>{{ transformedChannel.initials }}</p>
      </div>
      <h4 class="font-semibold">
        {{ name }}
      </h4>
    </header>
    <div v-if="!transformedChannel.archivedAt" class="flex items-center justify-center gap-4">
      <template v-for="opt in options" :key="opt.key">
        <div
          v-if="checkPermissions(opt.permission)"
          class="group flex flex-col items-center justify-center gap-2"
        >
          <VIconButton
            :icon="opt.icon"
            :invert="true"
            class="border-2 border-indigo-200 bg-indigo-100 group-hover:border-slate-500 
            dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-800 
            dark:group-hover:bg-slate-900"
            @click="modal(opt.key)"
          />
          <p class="text-sm text-gray-600 dark:text-slate-400">
            {{ opt.title }}
          </p>
        </div>
      </template>

      <VModal @close="onClose" :is-open="open.modalState">
        <template>
          <InvitationPublic
            :color="transformedChannel.color"
            :id-channel="channel.id"
            @action="(idUser: string) => inviteMember(channel.id, idUser)"
          />
        </template>

        <template v-if="open.theme">
          <ChatColorSelector @color="changeTheme" />
        </template>

        <template v-if="open.profile">
          <VProfileForm />
        </template>
      </VModal>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { useUserStore } from "@/stores/useUserStore"
  import { useUserProfileStore } from "@/stores/useProfileStore"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VIconButton from "@/components/molecules/VIconButton.vue"
  import VAvatar from "@/components/molecules/VAvatar.vue"
  import InvitationPublic from "@/components/organisms/InvitationPublic.vue"
  import ChatColorSelector from "@/components/organisms/ChatColorSelector.vue"
  import VProfileForm from "@/components/organisms/VProfileForm.vue"
  import VModal from "../atoms/VModal.vue"

  import {
    ChannelVariantEnum,
    DIRECT_CHANNEL,
    GROUP_CHANNEL,
  } from "@/types/Channel"
import { useUser } from "@/composables/useUser"
import { storeToRefs } from "pinia"

  const { getStatus, inviteMember } = useUserStore()
  const { getName } = useUserProfileStore()
  const { channel, channelInitials } = storeToRefs(useChannelStore())
  const { changeTheme } = useChannelStore()
  const loggedUser = useUser()
  const open = ref({
    modalState: false,
    member: false, 
    theme: false, 
    profile: false
  })
  const options = ref([
    {
      key: 'member',
      title: 'Member',
      icon: './src/assets/images/add.svg',
      permission: [GROUP_CHANNEL]
    },
    {
      key: 'theme',
      title: 'Theme',
      icon: './src/assets/images/theme.svg',
      permission: [DIRECT_CHANNEL, GROUP_CHANNEL]
    }
  ])

  const name = computed(() => channel.value && 'title' in channel.value ? channel.value.title : getName(userId.value))

  const checkPermissions = (type: Array<string>): boolean => {
    return ChannelVariantEnum.array().safeParse(type).success && type.includes(transformedChannel.value.channelType!)
  } 

  const userId = computed(() => {
    if ('idReceiver' in channel.value) {
      return loggedUser?.id === channel.value.idUser ? channel.value.idReceiver : channel.value.idUser
    } else {
      return channel.value.idUser
    }
  }) 
  
  const transformedChannel = computed(() => {
    return {
      color: channel.value.color || "",
      initials: channelInitials.value,
      isPublic: channel.value.channelType === GROUP_CHANNEL || false,
      archivedAt: channel.value.archivedAt,
      channelType: channel.value.channelType,
      status: getStatus(userId.value)
    }

  })

  const onClose = () => {
    open.value = {
      modalState: false,
      member: false,
      theme: false,
      profile: false
    }
  }

  const modal = (key: string) => {
    switch(key) {
      case 'member': 
        open.value.modalState = true
        open.value.member = true
        break;

      case 'theme':
        open.value.modalState = true
        open.value.theme = true
        break;

      case 'profile': 
        open.value.modalState = true
        open.value.profile = true
        break;
    }

    console.log(open.value)
  }
</script>
