<template>
  <form
    @submit.prevent="create"
    class="flex w-96 max-w-full flex-col justify-center gap-3 rounded-lg bg-white p-5 shadow-md dark:bg-slate-900"
  >
    <div
      class="relative flex flex-col-reverse items-center justify-start pl-5"
      @mouseenter="onAvatar = true"
      @mouseleave="onAvatar = false"
    >
      <VIconButton
        v-if="!viewOnly"
        @click="removeImage"
        size="small"
        rounded
        :hasPadding="true"
        icon="./src/assets/images/close.svg"
        class="scale-75"
        :class="
          viewOnly
            ? 'hidden'
            : 'absolute bottom-0 right-32 z-20 -translate-x-1 -translate-y-8 bg-red-500 p-0.5 focus:border-indigo-600 dark:focus:border-indigo-600'
        "
        :hidden="!onAvatar"
      />
      <VAvatar
        :image="
          formData.image
            ? formData.image
            : './src/assets/images/default-avatar.svg'
        "
        size="xlarge"
        :status="userStore.getStatus(id)"
      />
      <input
        @change="attachFile"
        hidden
        class="hidden"
        type="file"
        ref="fileInput"
      />
      <VIconButton
        v-if="!viewOnly"
        @click="openFileSelector"
        size="xsmall"
        icon="./src/assets/images/edit.svg"
        rounded
        class="absolute right-32 z-20 -translate-x-2 translate-y-0.5 bg-indigo-600 focus:border-indigo-600 dark:bg-slate-800 dark:focus:border-indigo-600"
      />
    </div>
    <p
      v-if="error"
      class="rounded-md border border-red-600 bg-red-500/10 p-3 text-center text-sm text-red-500"
    >
      {{ error }}
    </p>
    <label for="nickname">Nickname</label>
    <VInput
      id="nickname"
      v-model.trim="formData.nickName"
      class="rounded-md border-2 border-gray-300 bg-gray-50 outline-none dark:border-slate-700 dark:bg-slate-800"
      :class="
        viewOnly
          ? 'border-gray-300'
          : 'hover:border-indigo-600 focus:border-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600'
      "
      v-focus
      :disabled="viewOnly"
    />
    <label for="firstname">Firstname</label>
    <VInput
      id="firstname"
      v-model.trim="formData.firstName"
      class="rounded-md border-2 border-gray-300 bg-gray-50 outline-none dark:border-slate-700 dark:bg-slate-800"
      :class="
        viewOnly
          ? 'border-gray-300'
          : 'hover:border-indigo-600 focus:border-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600'
      "
      :disabled="viewOnly"
    />
    <label for="lastname">Lastname</label>
    <VInput
      id="lastname"
      v-model.trim="formData.lastName"
      class="rounded-md border-2 border-gray-300 bg-gray-50 outline-none dark:border-slate-700 dark:bg-slate-800"
      :class="
        viewOnly
          ? 'border-gray-300'
          : 'hover:border-indigo-600 focus:border-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600'
      "
      :disabled="viewOnly"
    />
    <label for="email">Email</label>
    <VInput
      id="email"
      size="medium"
      v-model.trim="formData.email"
      class="rounded-md border-2 border-gray-300 bg-gray-50 outline-none dark:border-slate-700 dark:bg-slate-800"
      :class="
        viewOnly
          ? 'border-gray-300'
          : 'hover:border-indigo-600 focus:border-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600'
      "
      :disabled="viewOnly"
    />
    <VButton
      v-if="!viewOnly && method === 'POST'"
      action="submit"
      class="text-md mt-4 rounded-md bg-indigo-600 px-5 py-3 text-white"
    >
      Add
    </VButton>
    <VButton
      v-else-if="!viewOnly && method === 'PUT'"
      action="submit"
      class="text-md mt-4 rounded-md bg-indigo-600 px-5 py-3 text-white"
    >
      Update
    </VButton>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { z } from "zod"
import { useUserStore } from "@/stores/useUserStore"
import { useProfileStore } from "@/stores/useProfileStore"
import VAvatar from "@/components/molecules/VAvatar.vue"
import VIconButton from "@/components/molecules/VIconButton.vue"
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"
import type { ProfileData } from "@/types/Profile"

const props = defineProps<{
  id: string
  viewOnly?: boolean
}>()

const emits = defineEmits<{
  submit: []
}>()

const fileSchema = z.coerce.string()
const userStore = useUserStore()
const profileStore = useProfileStore()
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus(),
}

const method = ref<"POST" | "PUT">()
const error = ref<string>("")
const fileInput = ref<HTMLInputElement>()
const onAvatar = ref<boolean>(false)
const formData = ref<ProfileData>({
  nickName: "",
  firstName: "",
  lastName: "",
  image: "",
  email: "",
})

onMounted(() => {
  doesExist()
})

const openFileSelector = () => {
  fileInput.value?.click()
}

const attachFile = () => {
  if (
    fileSchema.safeParse(fileInput.value).success &&
    fileInput.value instanceof HTMLInputElement &&
    fileInput.value?.files
  ) {
    const file = fileInput.value.files[0]
    const reader = new FileReader()
    const isImage = /\.(jpe?g|png|gif)$/.test(file.name)
    if (isImage) {
      reader.onload = () => {
        formData.value.image = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeImage = () => {
  formData.value.image = ""
  if (fileInput.value) fileInput.value.value = ""
}

const create = async () => {
  try {
    let response
    if (method.value === "POST") {
      response = await profileStore.post(formData.value)
    } else {
      response = await profileStore.put(formData.value)
    }

    if (response?.status === 200) {
      emits("submit")
    } else {
      error.value = "Oops, something went wrong."
    }
  } catch (e) {
    const error = e as Error
    console.error(error.message)
  } finally {
    setTimeout(() => {
      error.value = ""
    }, 2000)
  }
}

const doesExist = () => {
  const userProfile = profileStore.getProfile(props.id)
  const user = userProfile.value?.nickName

  if (user) {
    const profile = profileStore.getProfile(props.id)
    method.value = "PUT"
    formData.value = {
      nickName: profile.value?.nickName,
      firstName: profile.value?.firstName,
      lastName: profile.value?.lastName,
      image: profile.value?.image,
      email: profile.value?.email,
    }
  } else {
    method.value = "POST"
    formData.value.nickName = user
  }
}
</script>
