<template>
  <div class="w-[420px] rounded-md bg-white p-4 shadow-md dark:bg-slate-900">
    <header>
      <h4 class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
        Invite member
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
      <ul class="flex max-h-56 flex-col gap-2 overflow-y-scroll">
        <template v-if="filteredUserName && filteredUserName.length > 0">
          <li
            v-for="[id, name] in filteredUserName"
            :key="id"
            class="flex items-center justify-between rounded-md px-4 py-2 hover:bg-gray-100 hover:dark:bg-slate-800/50"
          >
            <span> {{ name }} </span>
            <VButton
              @click="selectedUserName(id)"
              size="small"
              :class="color"
              class="cursor-pointer rounded-md text-gray-100"
            >
              Invite
            </VButton>
          </li>
        </template>
        <p v-else class="text-center text-sm">Nothing matched.</p>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useUser } from "@/composables/useUser"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"


const props = defineProps<{
  color: string
  idChannel: string
}>()

const emits = defineEmits<{
  action: [value: string]
}>()

const userStore = useUserStore()
const channelUserStore = useChannelUserStore()
const profileStore = useUserProfileStore()
const users = userStore.getUsers
const loggedUser = useUser()

const invitedUsers = ref<string[]>([])
const unInvitedUsers = ref<[string, string | undefined][]>([])
const inputUserName = ref<string>("")

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

onMounted(async () => {
  (await channelUserStore.getChannelUsers(props.idChannel))?.forEach((cu) => invitedUsers.value.push(cu.idUser))
  users.value.forEach((u) => {
    if (!invitedUsers.value.includes(u.id)) {
      const id = u.id
      const name = profileStore.getName(u.id)
      unInvitedUsers.value.push([id, name])
    }
  })
})

const isInvited = (idUser: string) => invitedUsers.value.includes(idUser)

const selectedUserName = (idUser: string) => {
  invitedUsers.value.push(idUser)
  emits("action", idUser)
}
</script>
