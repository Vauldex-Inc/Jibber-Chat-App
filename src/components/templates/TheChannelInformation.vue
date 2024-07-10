<template>
  <aside class="w-[350px] h-screen">
    <header
      :class="divider"
      class="z-40 border-b bg-white px-5 py-[30px] text-xl font-bold capitalize text-gray-700  dark:bg-slate-950 dark:text-gray-300"
    >
      <h3>{{ title }}</h3>
    </header>

    <div :class="divider">
      <slot name="details" />
    </div>

    <div :class="divider">
      <slot name="members" />
    </div>

    <div>
      <slot name="images" />
    </div>
  </aside>
</template>

<script setup>
  const title = 'Channel Information'
  const divider = 'border-b border-b-indigo-200 dark:border-b-slate-800'
</script>
