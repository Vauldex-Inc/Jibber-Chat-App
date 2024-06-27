<template>
  <VButton
    v-if="theme === 'light'"
    @click="setTheme('dark')"
    class="flex w-full items-center gap-3"
  >
    <img class="aspect-square h-7" src="@/assets/images/moon.svg" />
    <span>Theme • ( Light )</span>
  </VButton>
  <VButton
    v-else
    @click="setTheme('light')"
    class="flex w-full items-center gap-3"
  >
    <img class="aspect-square h-7" src="@/assets/images/sun.svg" />
    <span>Theme • ( Dark )</span>
  </VButton>
</template>

<script lang="ts" setup>
import VButton from "@/components/atoms/VButton.vue"
import { useTheme } from "@/composables/useTheme"

const { setTheme, getTheme } = useTheme()

const theme = getTheme()
</script>
