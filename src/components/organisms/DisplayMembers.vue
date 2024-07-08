<template>
  <div
    v-if="!stateDisplayProfile"
    class="w-[420px] rounded-md bg-white py-5 shadow-md dark:bg-slate-900"
  >
    <header class="px-5">
      <h4 class="pb-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
        Members
      </h4>
      <hr
        class="my-3 border-0 border-b border-b-indigo-300 dark:border-b-slate-700"
      />
    </header>
    <ul class="flex max-h-96 flex-col gap-4 overflow-y-scroll scroll-auto px-5">
      <template v-for="user in transformUsers" :key="user?.id">
        <li
          v-if="user"
          class="flex items-center justify-between rounded-md px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800"
          @click="selectedProfile(user.id)"
        >
          <div class="flex items-center gap-4">
            <template v-if="user.hasProfile">
              <VAvatar
                :image="user.image"
                :status="user.status"
                type="preview"
                size="xlarge"
              />
              <div class="flex flex-col">
                <span class="font-semibold">{{ user.name }}</span>
                <span
                  v-if="user.hasNickname"
                  class="text-xs"
                  >({{ user.nickname }})</span
                >
              </div>
            </template>
            <template v-else>
              <VAvatar />
              <div class="flex flex-col">
                <span>{{ user.nickname }}</span>
              </div>
            </template>
          </div>
        </li>
      </template>
    </ul>
  </div>
  <VModal @close="closeDisplayProfile" :is-open="stateDisplayProfile">
    <VProfileForm :id="sender" :viewOnly="true" />
  </VModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useUserStore } from "@/stores/useUserStore"
import VAvatar from "@/components/molecules/VAvatar.vue"
import VProfileForm from "@/components/organisms/VProfileForm.vue"
import VModal from "@/components/atoms/VModal.vue"
import { type User } from "@/types/User"
import { useProfileStore } from "@/stores/useProfileStore"
import type { ChannelUser } from "@/types/Channel"
import { useChannelStore } from "@/stores/useChannelStore"

const props = defineProps<{
  idChannel: string
}>()

const emits = defineEmits<{
  close: [value: boolean]
}>()

const userStore = useUserStore()
const channelStore = useChannelStore()
const userProfileStore = useProfileStore()

const channelUsers = ref<ChannelUser[] | undefined>([])
const users = ref<(User | undefined)[]>([])
const sender = ref<string>("")
const stateDisplayProfile = ref<boolean>(false)

const transformUsers = computed(() => users.value.map((u) => {
    return {
      id: u!.id,
      hasProfile: userProfileStore.getProfile(u!.id),
      hasNickname: userProfileStore.getNickname(u!.id),
      image: userProfileStore.getImage(u!.id),
      status: getStatus(u!.id),
      name: userProfileStore.getName(u!.id),
      nickname: userProfileStore.getNickname(u!.id)
    }
  }))

const getStatus = (id: string): "online" | "offline" | undefined => {
  return userStore.getOnlineUsers().value.indexOf(id) !== -1
    ? "online"
    : "offline"
}

onMounted(async () => {
  channelUsers.value = await channelStore.getChannelUsers(props.idChannel)
  if (channelUsers.value) {
    users.value = channelUsers.value.map((channelUser) => {
      return userStore.getUser(channelUser.idUser)
    })
  }
})

const closeDisplayProfile = () => {
  stateDisplayProfile.value = false
  emits("close", false)
}

const selectedProfile = (id: string) => {
  stateDisplayProfile.value = !stateDisplayProfile.value
  sender.value = id
}
</script>
