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
      <li
        v-for="[user, profile] in users"
        class="flex items-center justify-between rounded-md px-4 py-2 hover:bg-gray-100 hover:dark:bg-gray-800"
        @click="selectedProfile(user.id)"
      >
        <div class="flex gap-4">
          <template v-if="profile">
            <VAvatar :image="profile.image" :status="getStatus(user.id)" />
            <div class="flex flex-col">
              <span class="font-semibold">{{
                userStore.getUserNameById(user.id)
              }}</span>
              <span v-if="profile.nickName" class="text-xs"
                >({{ profile.nickName }})</span
              >
            </div>
          </template>
          <template v-else>
            <VAvatar />
            <div class="flex flex-col">
              <span>{{ user.username }}</span>
            </div>
          </template>
        </div>
      </li>
    </ul>
  </div>
  <VModal @close="closeDisplayProfile" :is-open="stateDisplayProfile">
    <VProfileForm :sender="sender" :viewOnly="true" />
  </VModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useChannelUserStore } from "@/stores/useChannelUserStore.ts";
import { useUserStore } from "@/stores/useUserStore.ts";
import VAvatar from "@/components/atoms/VAvatar.vue";
import VProfileForm from "@/components/organisms/VProfileForm.vue";
import VModal from "@/components/atoms/VModal.vue";

import { type User } from "@/types/User";
import { type Profile } from "@/types/Profile";

const userStore = useUserStore();

const channelUserStore = useChannelUserStore();
const props = defineProps<{
  channelId: string;
}>();
const emits = defineEmits<{
  close: [value: boolean];
}>();

const getStatus = (id: string) => {
  return userStore.getOnlineUsers().value.indexOf(id) !== -1
    ? "online"
    : "offline";
};

const channelUsers = ref([]);
const users = ref<[User, Profile][]>([]);
const sender = ref<string>("");

const stateDisplayProfile = ref<boolean>(false);

const closeDisplayProfile = () => {
  stateDisplayProfile.value = false;
  emits("close", false);
};
const selectedProfile = (id: string) => {
  stateDisplayProfile.value = !stateDisplayProfile.value;
  sender.value = id;
};

onMounted(async () => {
  channelUsers.value = await channelUserStore.getChannelUsers(props.channelId);
  users.value = channelUsers.value.map((channelUser) => {
    return userStore.getUserById(channelUser.userId);
  });
});
</script>
