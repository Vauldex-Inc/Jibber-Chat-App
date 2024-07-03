<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 p-3">
      <p class="text-2xl font-bold capitalize text-gray-700 dark:text-gray-300">
        {{ title }}
      </p>
      <VIconButton
        class="bg-slate-700 dark:bg-slate-800"
        icon="./src/assets/images/add.svg"
        size="small"
        @click="emits('click')"
      >
      </VIconButton>
    </div>
    <ul class="overflow-y-scroll bg-white pb-5 dark:bg-slate-950">
      <template v-if="items.length !== 0">
        <VChatListItem
          @open="openChannel"
          v-for="item in items"
          :key="item.id"
          :item="item"
        />
      </template>
      <p v-else class="h-full pb-5 pt-10 text-center">No channels found.</p>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import VChatListItem from "@/components/organisms/VChatListItem.vue"
import VIconButton from "@/components/molecules/VIconButton.vue"
import type { Channel, DirectChannel } from "@/types/Channel.ts"

defineProps<{
  title: string
  items: Channel[] | DirectChannel[]
}>()

const emits = defineEmits<{
  open: [value: string, type: "SNG" | "MPU"]
  click: []
}>()

const openChannel = (id: string, type: "SNG" | "MPU") => {
  emits("open", id, type)
}
</script>
