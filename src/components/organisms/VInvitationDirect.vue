<template>
  <div class="w-[420px] rounded-md bg-white p-4 shadow-md dark:bg-slate-900">
    <header>
      <h4 class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
        Direct message
      </h4>
      <hr
        class="my-5 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"
      />
    </header>
    <form @submit.prevent class="relative">
      <VInput
        class="w-full rounded-md border-2 border-indigo-300 hover:border-indigo-600 focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:placeholder:text-gray-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600"
        v-model="inputUserName"
        type="text"
        placeholder="Enter name..."
        size="medium"
      />
      <input type="submit" hidden />
    </form>
    <div
      class="absolute left-0 top-40 w-full rounded-md bg-white px-2 py-5 shadow-md hover:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-600 dark:focus:border-indigo-600"
    >
      <ul
        v-if="filteredUserName.length > 0"
        class="flex max-h-56 flex-col gap-2 overflow-y-scroll"
      >
        <template v-for="[id, name] in filteredUserName" :key="id">
          <li
            class="flex items-center justify-between rounded-md px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800"
          >
            <span>
              {{ name }}
            </span>
            <VButton
              @click="create(id, name)"
              size="small"
              :class="color"
              class="cursor-pointer rounded-md text-gray-100"
            >
              Message
            </VButton>
          </li>
        </template>
      </ul>
      <p v-else class="text-center text-sm">Nothing matched.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

import { useUserStore } from "@/stores/useUserStore"
import { useDirectChannelStore } from "@/stores/useDirectChannelStore"

import { useUser } from "@/composables/useUser"
import { useUserProfileStore } from "@/stores/useUserProfileStore"

import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"

import type { Channel } from "@/types/Channel"

const directStore = useDirectChannelStore()

defineProps<{
  color: string
}>()

const emits = defineEmits<{
  submit: [channel: Channel | undefined]
}>()

const profileStore = useUserProfileStore()
const userStore = useUserStore()
const users = userStore.getUsers()
const loggedUser = useUser()

const inputUserName = ref<string>("")
const unInvitedUsers = ref<[string, string | undefined][]>([])
const invitedUsers = ref<string[]>([])

const filteredUserName = computed(() => {
  return unInvitedUsers.value.filter(([id, _]) => {
    const currentName = inputUserName.value.toLowerCase()
    return (
      profileStore.getName(id).toLowerCase().includes(currentName) &&
      !isInvited(id) &&
      id !== loggedUser?.id
    )
  })
})

const isInvited = (idUser: string) => invitedUsers.value.includes(idUser)

onMounted(async () => {
  directStore.channels.value.forEach((c) => invitedUsers.value.push(c.idUser))
  users.value.forEach((u) => {
    if (!invitedUsers.value.includes(u.id)) {
      const id = u.id
      const name = profileStore.getName(u.id)
      unInvitedUsers.value.push([id, name])
    }
  })
})

const create = async (idUser?: string, name?: string) => {
  try {
    if (idUser) {
      await directStore.post(idUser)
      const index = unInvitedUsers.value.indexOf([idUser, name])
      unInvitedUsers.value.splice(index, 1)
      invitedUsers.value.push(idUser)
    }
  } catch (e) {
    const error = e as Error
    console.error(error.message)
  }
}
</script>
