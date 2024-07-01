<template>
  <form
    @submit.prevent="create"
    class="flex w-[420px] flex-col gap-4 rounded-md bg-white p-5 shadow-md dark:bg-slate-900"
  >
    <h4
      v-if="variant === 'MPU'"
      class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300"
    >
      Create new public channel
    </h4>
    <h4
      v-else
      class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300"
    >
      Direct message
    </h4>
    <p
      v-if="error"
      class="rounded-md border border-red-600 bg-red-500/10 p-3 text-center text-sm text-red-500"
    >
      {{ error }}
    </p>
    <VInput
      class="w-full rounded-md border-2 border-gray-300 bg-gray-50 pr-12 outline-none hover:border-indigo-600 focus:border-indigo-600 dark:bg-slate-800 dark:placeholder:text-gray-500"
      size="medium"
      v-model="channelForm.title"
      v-focus
      :placeholder="variant === 'MPU' ? 'Channel name' : 'Name'"
    />
    <VButton
      class="text-md mt-4 rounded-md bg-indigo-600 text-white"
      size="medium"
      action="submit"
      >Submit</VButton
    >
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { z } from "zod"
import { useFetch } from "@/composables/useFetch"
import type { Channel } from "@/types/Channel"
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"

const props = defineProps<{
  variant: "MPU" | "MPR" | "SNG" | undefined
}>()

interface ChannelData {
  title: string
  channelType: string
  archivedAt?: string
  color?: string
}

const emits = defineEmits<{
  submit: [value: Channel | undefined]
}>()

const errorSchema = z.object({
  message: z.string(),
})

const error = ref<string>("")
const channelForm = ref<ChannelData>({
  title: "",
  channelType: props.variant!,
})

const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus(),
}

const create = async () => {
  try {
    if (channelForm.value.title) {
      const response = await useFetch("/channels", {
        method: "POST",
        body: JSON.stringify(channelForm.value),
      })

      if (response.status === 200) {
        const result = await response.json()

        const channel = result.channel

        await useFetch(`/channels/${channel.id}/users`, {
          method: "POST",
          body: JSON.stringify({}),
        })

        emits("submit", channel)
      }
    } else {
      if (props.variant === "MPU") {
        error.value = "Please provide a channel name."
      } else {
        error.value = "Please provide a name."
      }
    }
  } catch (error) {
    emits("submit", undefined)
    const errorMessage = errorSchema.safeParse(error).data?.message
    throw new Error(`Error: ${errorMessage}`)
  } finally {
    setTimeout(() => {
      error.value = ""
    }, 1500)
  }
}
</script>
