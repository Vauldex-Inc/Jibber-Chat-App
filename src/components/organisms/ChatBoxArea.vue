<template>
  <ul
    ref="chatList"
    :class="{ 'opacity-50': channel.archivedAt }"
    class="flex flex-col gap-8 overflow-y-scroll border-b border-b-indigo-200 bg-gray-100 p-5 dark:border-b-slate-800 dark:bg-slate-900"
  >
    <li :class="align(message)" v-for="message in messages" :key="message.id">
      <ChatBalloon :message="message" :color="channel.color"/>
    </li>
    
    <li>
      <p
        v-if="messages.length < 1"
        class="rounded-md border border-gray-300 bg-gray-200 p-3 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-slate-800"
      >
        {{ defaultMessage.header }}
      </p>
    </li>

    <li>
      <template v-if="channel.archivedAt">
        <hr
          class="border-0 border-b border-b-slate-300 dark:border-b-slate-800"
        />
        <p
          class="py-28 text-center text-lg font-semibold text-gray-600 dark:text-gray-500"
        >
          {{ defaultMessage.footer }}
        </p>
      </template>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { onUpdated, ref } from "vue"
import ChatBalloon from "@/components/organisms/ChatBalloon.vue"
import type { Message } from "@/types/Message.ts"
import type { PublicChannel, DirectChannel } from "@/types/Channel.ts"
import { useUser } from "@/composables/useUser";

defineProps<{
  messages: Message[]
  channel: PublicChannel | DirectChannel
}>()

const loggedUser = useUser()
const chatList = ref<HTMLElement | undefined>(undefined)
const defaultMessage = {
  header : "Sometimes you don't need to write a long letter. A simple 'I'm thinking of you' can brighten someone's day.' - Mitchi Albom",
  footer : "This channel have been archived by the owner"
}

const align = (message: Message) => {
  return message.idUser === loggedUser?.id ? `self-end` : 'self-start'
}

onUpdated(() => {
  if (chatList.value) {
    chatList.value.scrollTo({
      behavior: "smooth",
      top: chatList.value.scrollHeight,
    })
  }
})
</script>
