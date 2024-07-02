<template>
  <div
    class="h-54 flex w-96 flex-col justify-between gap-4 rounded-md bg-white p-5 text-gray-700 shadow-md dark:bg-slate-900"
  >
    <header>
      <h4 class="inline font-bold text-gray-600 dark:text-gray-300">
        Invitation
      </h4>
    </header>
    <hr class="border-0 border-b border-b-indigo-300 dark:border-b-slate-800" />
    <div class="flex items-center gap-4 p-5">
      <span
        class="flex items-center justify-center rounded-full bg-indigo-600 p-4"
      >
        <img src="@/assets/images/notif.svg" class="aspect-square h-8" />
      </span>
      <p class="text-center dark:text-gray-400">
        {{ name }} invited you to join
        his/her channel.
      </p>
    </div>
    <hr class="border-0 border-b border-b-indigo-300 dark:border-b-slate-800" />
    <footer class="flex gap-4 self-end">
      <VButton
        class="rounded-md border bg-indigo-300 text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-gray-400"
        @click="emits('close')"
        >Close</VButton
      >
      <VButton
        class="rounded-md border bg-indigo-600 text-white dark:border-slate-800"
        @click="emits('view', notification.idChannel)"
        >Take a Look</VButton
      >
    </footer>
  </div>
</template>

<script setup lang="ts">
import VButton from "@/components/atoms/VButton.vue"
import type { Invitation } from "@/types/Notification"

defineProps<{
  notification: Invitation
  name: string
}>()

const emits = defineEmits<{
  close: []
  view: [value: string]
}>()
</script>
