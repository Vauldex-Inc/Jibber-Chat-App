<template>
  <div class="flex items-end gap-2 p-5">
    <input
      @change="attachFile"
      hidden
      class="hidden"
      type="file"
      ref="fileInput"
    />
    <VIconButton
      :disabled="channel.archivedAt !== undefined"
      @click="openFileSelector"
      size="large"
      :class="[curColorTheme, { 'opacity-50': channel.archivedAt }]"
      icon="./src/assets/images/file.svg"
    />
    <div
      class="flex-1 overflow-hidden rounded-md p-0.5"
      :class="[
        curColorTheme,
        isInputTextFocus ? 'bg-opacity-100' : 'bg-opacity-30',
      ]"
    >
      <div
        v-if="imageForm.image"
        class="m-1 mb-1 flex inline-flex items-center rounded-md bg-white px-1 py-1 dark:bg-slate-700"
      >
        <img
          v-if="typeof imageForm.image === 'string'"
          class="h-8 w-8 object-cover p-1"
          :src="imageForm.image"
          alt="Attached image"
        />
        <p>{{ imageForm.title }}</p>
        <VIconButton
          @click="remove"
          class="pl-2"
          icon="./src/assets/images/close.svg"
          size="small"
          :invert="true"
        />
      </div>
      <VInput
        :disabled="channel.archivedAt !== undefined"
        @focus="isInputTextFocus = true"
        @blur="isInputTextFocus = false"
        @keyup.enter="sendMessage"
        v-model.trim="message"
        :placeholder="
          channel.archivedAt ? 'You can\'t reply to this channel' : 'Aa'
        "
        class="w-full rounded-md bg-gray-100 dark:bg-slate-900 dark:placeholder:text-gray-600"
        size="large"
      />
    </div>
    <VIconButton
      :disabled="channel.archivedAt !== undefined"
      @click="sendMessage"
      size="large"
      :class="[curColorTheme, { 'opacity-50': channel.archivedAt }]"
      icon="./src/assets/images/send.svg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { z } from 'zod'
import VInput from "@/components/atoms/VInput.vue"
import VIconButton from "@/components/atoms/VIconButton.vue"
import type { Channel, DirectChannel } from "@/types/Channel.ts"

const props = defineProps<{
  channel: Channel | DirectChannel
}>()

interface ImageForm {
  image: string | ArrayBuffer | null
  title: string
}

const emits = defineEmits<{
  send: [message: string, image?: string]
}>()

const fileSchema = z.coerce.string()

const isInputTextFocus = ref<boolean>(false)
const fileInput = ref<HTMLInputElement | string | undefined>(undefined)
const message = ref<string>("")
const imageForm = ref<ImageForm>({
  image: "",
  title: "",
})
const isMessageWithImage = ref<boolean>(false)

const curColorTheme = computed(() => {
  return props.channel.color ? props.channel.color : "bg-slate-800"
})

const remove = () => {
  message.value = ""
  imageForm.value.image = ""
  fileInput.value = ""
  isMessageWithImage.value = false
}

const sendMessage = () => {
  if (isMessageWithImage.value && typeof imageForm.value.image == "string") {
    emits(
      "send",
      message.value ? message.value : "Sent an image",
      imageForm.value.image,
    )
  } else if (message.value) {
    emits("send", message.value)
  }
  message.value = ""
  imageForm.value.image = ""
  isMessageWithImage.value = false
}

const openFileSelector = () => {
  if (fileInput.value && fileInput.value instanceof HTMLInputElement) {
    fileInput.value.click()
  }
}

const attachFile = () => {
  if (
    fileSchema.safeParse(fileInput.value).success &&
    fileInput.value instanceof HTMLInputElement &&
    fileInput.value?.files
  ) {
    const file = fileInput.value?.files[0]
    const reader = new FileReader()
    const isImage = /\.(jpe?g|png|gif)$/.test(file.name)

    if (isImage) {
      reader.onload = () => {
        imageForm.value.image = reader.result
        imageForm.value.title = file.name
        isMessageWithImage.value = true
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>
