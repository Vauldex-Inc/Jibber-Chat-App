<template>
  <div
    class="w-[420px] items-center rounded-md bg-white p-5 shadow-md dark:bg-slate-900"
  >
    <header>
      <h4 class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
        Select Theme
      </h4>
      <hr
        class="my-3 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"
      />
    </header>
    <ul class="flex flex-wrap gap-5 p-2">
      <li
        v-for="color in colorOptions"
        :key="color"
        :class="color"
        class="aspect-square w-14 cursor-pointer rounded-full border-4 border-transparent transition-all hover:border-gray-700 dark:hover:border-white"
        @click="emits('color', color)"
      ></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  color: [value: string]
}>()

const colorOptions = [
  "bg-red-600",
  "bg-orange-600",
  "bg-amber-600",
  "bg-yellow-600",
  "bg-lime-600",
  "bg-green-600",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-cyan-600",
  "bg-sky-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-purple-600",
  "bg-fuchsia-600",
]
</script>
