<template>
  <ul
    ref="chatList"
    :class="{ 'opacity-50': channel.archivedAt }"
    class="flex flex-col gap-8 overflow-y-scroll border-b border-b-indigo-200 bg-gray-100 p-5 dark:border-b-slate-800 dark:bg-slate-900"
  >
    <VChatBalloon
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :color="channel.color"
    />
    <p
      v-if="messages.length === 0"
      class="rounded-md border border-gray-300 bg-gray-200 p-3 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-slate-800"
    >
      "Sometimes you don't need to write a long letter. A simple 'I'm thinking
      of you' can brighten someone's day." - Mitchi Albom
    </p>
    <template v-if="channel.archivedAt">
      <hr
        class="border-0 border-b border-b-slate-300 dark:border-b-slate-800"
      />
      <p
        class="py-28 text-center text-lg font-semibold text-gray-600 dark:text-gray-500"
      >
        This channel have been archived by the owner
      </p>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import type { Message } from "@/types/Message.ts";
import type { Channel } from "@/types/Channel.ts";
import VChatBalloon from "@/components/organisms/VChatBalloon.vue";
import { onUpdated, ref } from "vue";

const chatList = ref<HTMLElement | undefined>(undefined);

onUpdated(() => {
  if (chatList.value) {
    chatList.value.scrollTo({
      behavior: "smooth",
      top: chatList.value.scrollHeight,
    });
  }
});

defineProps<{
  messages: Message[];
  channel: Channel;
}>();
</script>
