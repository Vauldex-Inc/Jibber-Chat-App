<template>
  <div class="flex h-full flex-col">
    <p
      class="z-40 border-b border-b-indigo-200 bg-white px-5 py-[30px] text-xl font-bold capitalize text-gray-700 dark:border-b-slate-800 dark:bg-slate-950 dark:text-gray-300"
    >
      {{ title }}
    </p>
    <div class="flex-1 overflow-y-scroll bg-white pb-24 dark:bg-slate-950">
      <div
        class="flex flex-col items-center justify-center gap-5 px-5 pb-5 pt-16"
      >
        <template v-if="channelType === DIRECT_CHANNEL">
          <div>
            <VAvatar
              size="xlarge"
              :status="sender ? userStore.getStatus(sender) : 'offline'"
              @click="modal.toggle('stateDisplayProfile')"
            />
            <p
              class="mt-2 rounded-md p-1 text-center text-sm capitalize"
              :class="
                sender && userStore.getStatus(sender) === StatusSchema.enum.online
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-slate-900'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              "
            >
              {{ sender ? userStore.getStatus(sender) : StatusSchema.enum.offline }}
            </p>
          </div>
          <p class="font-semibold">
            {{ sender && userProfileStore.getName(sender) }}
          </p>
          <VModal 
            @close="modal.toggle('stateDisplayProfile')" 
            :is-open="modal.stateDisplayProfile.value"
          >
            <VProfileForm :sender="sender" :viewOnly="true" />
          </VModal>
        </template>
        <template v-else>
          <div
            class="flex aspect-square h-16 items-center justify-center rounded-full text-white"
            :class="color"
          >
            <p class="text-xl">{{ channelAbbr }}</p>
          </div>
          <p class="font-semibold">
            {{ publicChannelStore.getTitle(channel.id) }}
          </p>
        </template>
        <div class="flex items-center justify-center gap-4">
          <div
            v-if="channelType !== DIRECT_CHANNEL"
            class="group flex flex-col items-center justify-center gap-2"
          >
            <VIconButton
              @click="modal.toggle('stateMemberInvite')"
              :disabled="channel.archivedAt !== undefined"
              icon="./src/assets/images/add.svg"
              :class="{ 'opacity-50': channel.archivedAt }"
              class="border-2 border-indigo-200 bg-indigo-100 group-hover:border-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-800 dark:group-hover:bg-slate-900"
              :invert="true"
            />
            <p class="text-sm text-gray-600 dark:text-slate-400">Member</p>
          </div>
          <div class="group flex flex-col items-center justify-center gap-2">
            <VIconButton
              :disabled="channel.archivedAt !== undefined"
              @click="modal.toggle('stateThemeSelector')"
              icon="./src/assets/images/theme.svg"
              :class="{ 'opacity-50': channel.archivedAt }"
              class="border-2 border-indigo-200 bg-indigo-100 group-hover:border-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-800 dark:group-hover:bg-slate-900"
              :invert="true"
            />
            <p class="text-sm text-gray-600 dark:text-slate-400">Theme</p>
          </div>
        </div>
      </div>

      <hr
        class="my-5 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />

      <div class="p-5 mb-2 flex items-center justify-between">
        <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
          Members
        </p>
        <VButton
          size="small"
          @click="modal.toggle('stateDisplayAllMember')"
          class="rounded-md font-semibold capitalize hover:bg-indigo-100 dark:hover:bg-slate-900"
        >
          <p
            :class="channel.color"
            class="inline-block bg-clip-text text-transparent"
          >
            View All
          </p>
        </VButton>          
      </div>
      
      <div class="flex items-center gap-3 p-3">
        <img
          src="@/assets/images/profile.svg"
          class="aspect-square h-8 dark:invert"
        />
        <p>
          {{ channelUserStore.getChannelUsersCount(channel.id) }}
        </p>
      </div> 

      <hr
        class="my-5 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />

      <div class="p-5 mb-2 flex items-center justify-between">
        <p class="font-semibold capitalize text-gray-700 dark:text-gray-300">
          Images
        </p>
        <VButton
          size="small"
          @click="modal.toggle('stateDisplayImages')"
          class="rounded-md font-semibold capitalize hover:bg-indigo-100 dark:hover:bg-slate-900"
        >
          <p
            :class="channel.color"
            class="inline-block bg-clip-text text-transparent"
            v-if="sentImages.length > 0"
          >
            View All
          </p>
        </VButton>          
      </div>

      <div class="p-3">
        <ul
          class="flex flex-wrap items-start justify-center gap-1 overflow-y-scroll"
          v-if="sentImages.length !== 0"
        >
          <template v-for="image in sentImages.reverse().slice(0, 4)">
            <li v-if="image !== undefined">
              <img
                class="h-24 w-32 rounded-md border-2 border-slate-200 object-cover dark:border-slate-800"
                :src="image"
              />
            </li>
          </template>
        </ul>
        <p v-else class="text-center">No images found</p>
      </div>

      <hr
        class="my-5 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />
    </div>

    <VModal 
      @close="modal.toggle('stateDisplayImages')" 
      :is-open="modal.stateDisplayImages.value"
    >
      <ViewImage :chatImages="sentImages" />
    </VModal>

    <VModal 
      @close="modal.toggle('stateMemberInvite')" 
      :is-open="modal.stateMemberInvite.value"
    >
      <InvitationPublic
        @action="(idUser) => userStore.inviteMember(channel.id, idUser)"
        :color="color"
        :id-channel="channel.id"
      />
    </VModal>

    <VModal 
      @close="modal.toggle('stateThemeSelector')" 
      :is-open="modal.stateThemeSelector.value"
    >
      <ChatColorSelector @color="selectColor" />
    </VModal>

    <VModal 
      @close="modal.toggle('stateDisplayAllMembers')" 
      :is-open="modal.stateDisplayAllMembers.value"
    >
      <DisplayMembers :id-channel="channel.id" @close="modal.toggle('stateDisplayAllMembers')" />
    </VModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useModal } from "@/composables/useModal"
import VAvatar from "@/components/molecules/VAvatar.vue"
import VIconButton from "@/components/molecules/VIconButton.vue"
import VModal from "@/components/atoms/VModal.vue"
import ChatColorSelector from "@/components/organisms/ChatColorSelector.vue"
import InvitationPublic from "@/components/organisms/InvitationPublic.vue"
import DisplayMembers from "@/components/organisms/DisplayMembers.vue"
import ViewImage from "@/components/organisms/ViewImage.vue"
import VProfileForm from "@/components/organisms/VProfileForm.vue"
import VButton from "../atoms/VButton.vue"
import {
  ChannelSchema,
  DIRECT_CHANNEL,
  GROUP_CHANNEL
} from "@/types/Channel"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
import type { ChatInfoProp } from "@/types/Prop"
import { StatusSchema } from "@/types/User"

const props = defineProps<ChatInfoProp>()

const userStore = useUserStore()
const userProfileStore = useUserProfileStore()
const channelUserStore = useChannelUserStore()
const publicChannelStore = usePublicChannelStore()
const modal = useModal()

const sentImages = computed(() => {
  return props.images.filter((i) => i !== "")
})

const channelType = computed(() => {
  const typeValidation = ChannelSchema.safeParse(props.channel)
  return typeValidation.success ? GROUP_CHANNEL : DIRECT_CHANNEL
})

const channelAbbr = computed(() => {
  const abbrValidation = ChannelSchema.safeParse(props.channel)
  if (abbrValidation.success) {
    return abbrValidation.data.title.slice(0, 1)
  } else {
    return userProfileStore.getName(props.channel.idUser).slice(0, 1)
  }
})

const color = computed(() => {
  return props.channel.color ? props.channel.color : "bg-slate-800"
})

const selectColor = async (color: string) => {
  const editedChannel = { ...props.channel }

  try {
    const res = await channelUserStore.setChannelColor(editedChannel, color)
    if (res === 200) {
      props.channel.color = color
      publicChannelStore.updateChannelColor(editedChannel.id, color)
    } else {
      throw new Error("Failed to update color")
    }
  } catch (error) {
    error instanceof Error ? console.error(error.message) : ""
  }
  
  modal.toggle('stateThemeSelector')
}
</script>
