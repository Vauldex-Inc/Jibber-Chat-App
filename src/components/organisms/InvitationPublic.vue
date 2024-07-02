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
            <p
              v-if="checkInviteStatus(id)"
              class="rounded-md bg-slate-300 px-3 py-2 text-sm text-gray-700 dark:bg-slate-700 dark:text-gray-400"
            >
              Invited
            </p>
            <VButton
              v-else
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
import { ref, computed } from "vue"
import { useUserStore } from "@/stores/useUserStore"
import { useChannelUserStore } from "@/stores/useChannelUserStore"
import { useUserProfileStore } from "@/stores/useUserProfileStore"
import VInput from "@/components/atoms/VInput.vue"
import VButton from "@/components/atoms/VButton.vue"
import type { User } from "@/types/User"
import type { Profile } from "@/types/Profile"

const props = defineProps<{
  color: string
  idChannel: string
}>()

const emits = defineEmits<{
  action: [value: string]
}>()

const userStore = useUserStore()
const channelUserStore = useChannelUserStore()
const userProfileStore = useUserProfileStore()

const invitedUsers = ref<string[]>([])
const inputUserName = ref<string>("")

const users = computed(() => {
  const appUsers = userStore.getUsers()
  const nonMemberUsers = channelUserStore.getNonMembers(
    props.idChannel,
    appUsers.value,
  )

  return nonMemberUsers?.map((user: User) => {
    const userProfile = userProfileStore.getProfile(user.id)
    if (userProfile.value?.firstName && userProfile.value?.lastName) {
      return [user.id, `${userProfile.value.firstName} ${userProfile.value.lastName}`]
    } else if (userProfile.value?.nickName) {
      return [user.id, userProfile.value?.nickName]
    } else {
      return [user.id, user.username]
    }
  })
})

const filteredUserName = computed(() => {
  return users.value?.filter((userName) => {
    const searchedName = inputUserName.value.toLowerCase()
    return userName[1].toLowerCase().includes(searchedName)
  })
})

const checkInviteStatus = (idUser: string) =>
  invitedUsers.value.includes(idUser)

const selectedUserName = (idUser: string) => {
  invitedUsers.value.push(idUser)
  emits("action", idUser)
}
</script>
