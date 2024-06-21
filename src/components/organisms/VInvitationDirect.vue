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
        size="md"
      />
      <VInput type="submit" hidden />
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
              size="sm"
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
import { ref, computed, onMounted } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import { useUserStore } from "@/stores/useUserStore";
import type { User } from "@/types/User";
import type { Profile } from "@/types/Profile";
import VInput from "@/components/atoms/VInput.vue";
import VButton from "@/components/atoms/VButton.vue";
import { useUser } from "@/composables/useUser";
import { useChannelStore } from "@/stores/useChannelStore";

const channelStore = useChannelStore();

const props = defineProps<{
  color: string;
}>();

const emits = defineEmits<{
  submit: [channel: Channel | undefined];
}>();

const singleChannels = channelStore.getSingleChannels();

const privateChannels = computed(() => {
  return singleChannels.value.filter((s) => {
    const users = s.title.split("/");

    return users.some((u) => u === loggedUser.id);
  });
});

const userStore = useUserStore();
const users = userStore.getUsers();
const loggedUser = useUser();
const inputUserName = ref<string>("");
const invitedUsers = ref<string[]>([]);

const isInvited = (userId: string) => invitedUsers.value.includes(userId);

const filteredUserName = computed(() => {
  return users.value
    .filter((userProfile: [User, Profile]) => {
      const [user, profile] = userProfile;
      const currentName = inputUserName.value.toLowerCase();
      return (
        userStore
          .getUserNameById(user.id)
          .toLowerCase()
          .includes(currentName) && !isInvited(user.id)
      );
    })
    .map((userProfile: [User, Profile]) => {
      const [user, profile] = userProfile;
      return [user.id, userStore.getUserNameById(user.id)];
    });
});

const create = async (userId: string, name: string) => {
  try {
    const response = await useFetch("/channels", {
      method: "POST",
      body: JSON.stringify({
        title: `${loggedUser.id}/${userId}`,
        channelType: "SNG",
      }),
    });

    if (response.status === 200) {
      const result = await response.json();

      const channel = result.channel;

      const res = await useFetch(`/channels/${channel.id}/users`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      });

      invitedUsers.value.push(userId);
      emits("submit", channel);
    }
  } catch (err) {
    emits("submit", undefined);
    throw new Error(err);
  }
};

onMounted(() => {
  privateChannels.value.forEach((s) => {
    const users = s.title.split("/");

    users.forEach((u) => invitedUsers.value.push(u));
  });
});
</script>
