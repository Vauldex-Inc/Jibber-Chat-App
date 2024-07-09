<template>
  <form
    @submit.prevent="create"
    class="flex w-[420px] flex-col gap-4 rounded-md bg-white p-5 shadow-md dark:bg-slate-900"
  >
    <h4
      class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300"
    >
      Create new public channel
    </h4>
    <VFormError :error="error"/>
    <VInput
      class="w-full rounded-md border-2 border-gray-300 bg-gray-50 pr-12 outline-none hover:border-indigo-600 focus:border-indigo-600 dark:bg-slate-800 dark:placeholder:text-gray-500"
      size="medium"
      v-model="channelForm.title"
      v-focus
      placeholder="Channel name"
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
  import { usePublicChannelStore } from "@/stores/usePublicChannelStore"
  import VInput from "@/components/atoms/VInput.vue"
  import VButton from "@/components/atoms/VButton.vue"
  import VFormError from "@/components/atoms/VFormError.vue"
  import { type ChannelData } from "@/types/Channel"

  const emits = defineEmits(["onSuccess"])

  const publicCstore = usePublicChannelStore()
  const vFocus = { mounted: (el: HTMLInputElement) => el.focus() }

  const error = ref("")
  const channelForm = ref<ChannelData>({title: "", channelType: "MPU"})

  const create = async () => {
    try {
      if (channelForm.value.title) {
        publicCstore.post(channelForm.value)
      } else {
        throw Error("Please provide a channel name.")
      }
      emits("onSuccess")
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      setTimeout(() => {
        error.value = ""
      }, 1500)
    }
  }
</script>
