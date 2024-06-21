<template>
  <div
    class="relative flex h-screen justify-between bg-white dark:bg-slate-950"
  >
    <aside v-if="toggleChat" class="h-full w-[380px]">
      <div class="flex items-center justify-between p-5">
        <div class="flex items-center gap-3">
          <slot name="actions" />
        </div>
        <p
          class="flex flex-1 items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent"
        >
          Jibber
        </p>
        <div class="flex items-center gap-3">
          <slot name="notification" />
        </div>
      </div>
      <hr
        class="mb-2 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />
      <slot name="messages" />
      <hr
        class="mb-2 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />
      <slot name="channels" />
    </aside>
    <section
      :class="[{ 'pl-3': !toggleChat }, { 'pr-3': !toggleInfo }]"
      class="flex flex-1 flex-col justify-between border-x border-x-indigo-200 dark:border-x-slate-800"
    >
      <slot name="chatbox" />
    </section>
    <aside v-if="toggleInfo" class="w-[350px]">
      <slot name="chatinfo" />
    </aside>
    <section class="absolute right-0 top-0 z-40">
      <slot name="toast" />
    </section>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  toggleInfo: boolean;
  toggleChat: boolean;
}>();
</script>
