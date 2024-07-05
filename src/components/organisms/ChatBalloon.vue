<template>
  <li
    v-if="loggedUser"
    :class="message.idUser === loggedUser.id ? `self-end` : 'self-start'"
    class="flex items-start gap-4"
  >
    <VAvatar
      v-if="message.idUser !== loggedUser.id"
      :image="profileStore.getImage(message.idUser)"
      :status="userStore.getStatus(message.idUser)"
      type="message"
      size="xlarge"
    />
    <div class="flex flex-col items-start gap-2">
      <div
        :class="message.idUser === loggedUser.id ? 'self-end' : ''"
        class="flex items-center gap-1"
      >
        <template v-if="message.idUser !== loggedUser.id">
          <p class="text-xs">{{ profileStore.getName(message.idUser) }}</p>
          <p class="text-xs">•</p>
        </template>
        <p class="text-xs">{{ userStore.sentAtFormatter(message) }}</p>
      </div>
      <p
        :class="[
          message.idUser === loggedUser.id
            ? `self-end text-gray-100`
            : 'self-start text-gray-800 dark:text-gray-300',
          message.idUser === loggedUser.id && color
            ? color
            : 'bg-gray-300 text-gray-800 dark:bg-slate-800 dark:text-gray-300',
        ]"
        class="max-w-[250px] break-words rounded-lg p-3"
      >
        {{ message.text }}
        <img
          v-if="message.image"
          class="mt-2 aspect-auto max-h-48 rounded-md"
          :src="message.image"
        />
      </p>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { useUser } from "@/composables/useUser"
import { useUserStore } from "@/stores/useUserStore"
import { useUserProfileStore } from "@/stores/useProfileStore"
import VAvatar from "@/components/molecules/VAvatar.vue"
import type { Message } from "@/types/Message"

defineProps<{
  message: Message
  color?: string
}>()

const userStore = useUserStore()
const profileStore = useUserProfileStore()
const loggedUser = useUser()
</script>
