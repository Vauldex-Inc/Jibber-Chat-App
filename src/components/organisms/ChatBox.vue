<template>
  <div class="flex items-center gap-2 p-5">
    <input
      @change="attachFile"
      hidden
      class="hidden"
      type="file"
      ref="fileInput"
    />
    <VIconButton
      :disabled="channel.archivedAt"
      @click="openFileSelector"
      size="medium"
      :class="buttonClass"
      icon="./src/assets/images/file.svg"
    />
    <div
      class="flex-1 overflow-hidden rounded-md p-0.5"
      :class="buttonClass"
    >
      <div
        v-if="imageForm.image"
        class="m-1 mb-1 inline-flex items-center rounded-md bg-white px-1 py-1 dark:bg-slate-700"
      >
        <img
          class="h-8 w-8 object-cover p-1"
          :src="imageSrc"
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
        :disabled="channel.archivedAt"
        @focus="isInputTextFocus"
        @blur="!isInputTextFocus"
        @keyup.enter="sendMessage"
        v-model.trim="message"
        :placeholder="
          channel.archivedAt ? 'You can\'t reply to this channel' : 'Aa'
        "
        class="w-full rounded-md bg-gray-100 py-3 dark:bg-slate-900 dark:placeholder:text-gray-600"
        size="medium"
      />
    </div>
    <VIconButton
      :disabled="channel.archivedAt"
      @click="sendMessage"
      size="medium"
      :class="buttonClass"
      icon="./src/assets/images/send.svg"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue"
  import { storeToRefs } from "pinia"
  import { z } from "zod"
  import { useChannelStore } from "@/stores/useChannelStore"
  import VInput from "@/components/atoms/VInput.vue"
  import VIconButton from "@/components/molecules/VIconButton.vue"

  const emits = defineEmits<{
    send: [message: string, image?: string]
  }>()

  const fileSchema = z.coerce.string()
  const { channel } = storeToRefs(useChannelStore())
  interface ImageForm {
    image: string | ArrayBuffer | null
    title: string
  }

  const isInputTextFocus = ref<boolean>(false)
  const fileInput = ref<HTMLInputElement | string | undefined>(undefined)
  const message = ref<string>("")
  const imageForm = ref<ImageForm>({
    image: "",
    title: "",
  })
  const isMessageWithImage = ref<boolean>(false)

  const buttonClass = computed(() => {
    return [channel.value.color || "bg-slate-800",  
      channel.value.archivedAt ? 'opacity-50' : '']
  })

  const imageSrc = computed(() => {
    return imageForm.value.image as string
  })

  const remove = () => {
    message.value = ""
    imageForm.value.image = ""
    fileInput.value = ""
    isMessageWithImage.value = false
  }

  const sendMessage = () => {
    if (isMessageWithImage.value) {
      emits(
        "send",
        message.value ? message.value : "Sent an image",
        imageForm.value.image as string,
      )
    } else if (message.value) {
      emits("send", message.value)
    }

    message.value = ""
    imageForm.value.image = ""
    fileInput.value = undefined
    isMessageWithImage.value = false
  }

  const openFileSelector = () => {
    if (fileInput.value) {
      (fileInput.value as HTMLInputElement).click()
    }
  }

  const attachFile = () => {
    let data = fileInput.value as HTMLInputElement
    if (fileSchema.safeParse(data).success) {
      const file = data.files![0]
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
