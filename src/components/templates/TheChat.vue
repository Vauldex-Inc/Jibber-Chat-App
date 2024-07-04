<template>
  <div class="relative flex h-screen justify-between bg-white dark:bg-slate-950">
    <!-- Left Sidebar -->
    <slot name="left" />

    <!-- Chat box -->
    <main class="flex flex-1 flex-col justify-between border-x border-x-indigo-200
      dark:border-x-slate-800"
    >
      <slot name="chatbox" />
    </main>

    <!-- Right Sidebar -->
    <slot name="right" />
  </div>
</template>

<script lang="ts" setup>
  interface Prop {
    toggleInfo: boolean
    toggleChat: boolean
  }

  defineProps<Prop>()

  const divider = 'border-b border-b-indigo-200 dark:border-b-slate-800'
</script>
