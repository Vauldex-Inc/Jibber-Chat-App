<template>
  <aside class="w-[380px] h-screen">
    <header :class="divider" class="flex items-center justify-between p-5 mb-2">
      <h1
        class="flex flex-1 items-center justify-center bg-gradient-to-r from-indigo-600
        to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent order-2"
      >
        {{ title }}
      </h1>
      <div class="flex items-center gap-3 order-1">
        <slot name="actions" />
      </div>
      <div class="flex items-center gap-3 order-3">
        <slot name="notification" />
      </div>
    </header>

    <div class="h-2/6">
      <section :class="divider" class="mb-2 h-full overflow-y-scroll">
        <slot name="messages" />
      </section>
    </div>

    <div class="h-3/6">
      <section class="h-full overflow-y-scroll">
        <slot name="channels" />
      </section>
    </div>
  </aside>
</template>

<script setup>
  const title = 'Jibber'
  const divider = 'border-b border-b-indigo-200 dark:border-b-slate-800'
</script>
