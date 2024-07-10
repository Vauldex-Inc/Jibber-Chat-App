<template>
  <div class="relative flex h-screen justify-between bg-white dark:bg-slate-950">
    <!-- Left Sidebar -->
    <template v-if="openLeft">
      <slot name="left" />
    </template>

    <!-- Chat box -->
    <main class="flex flex-1 flex-col justify-between border-x border-x-indigo-200
      dark:border-x-slate-800"
    >
      <slot :toggleLeft="toggleLeft" :toggleRight="toggleRight" name="chatbox" />
    </main>

    <!-- Right Sidebar -->
    <template v-if="openRight">
      <slot name="right" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue"

  const openLeft = ref(true)
  const openRight = ref(true)

  const toggleRight = () => {
    openRight.value = !openRight.value
  }

  const toggleLeft = () => {
    openLeft.value = !openLeft.value
  }
</script>
