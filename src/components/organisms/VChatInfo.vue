<template>
  <div class="flex h-full flex-col">
    <p
      class="z-40 border-b border-b-indigo-200 bg-white px-5 py-[30px] text-xl font-bold capitalize text-gray-700 dark:border-b-slate-800 dark:bg-slate-950 dark:text-gray-300"
    >
      {{ title }}
    </p>
    <div class="flex-1 overflow-y-scroll bg-white pb-24 dark:bg-slate-950">
      <div
        class="flex flex-col items-center justify-center gap-5 px-5 pb-5 pt-16"
      >
        <template v-if="channel.channelType === 'SNG'">
          <div>
            <VAvatar
              size="lg"
              :status="sender ? userStore.senderStatus(sender) : 'offline'"
              @click="openDisplayProfile"
            />
            <p
              class="mt-2 rounded-md p-1 text-center text-sm capitalize"
              :class="
                sender && userStore.senderStatus(sender) === 'online'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-slate-900'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              "
            >
              {{ sender ? userStore.senderStatus(sender) : "offline" }}
            </p>
          </div>
          <p class="font-semibold">
            {{ sender && userStore.senderName(sender) }}
          </p>
          <VModal @close="closeDisplayProfile" :is-open="stateDisplayProfile">
            <VProfileForm :sender="sender" :viewOnly="true" />
          </VModal>
        </template>
        <template v-else>
          <div
            class="flex aspect-square h-16 items-center justify-center rounded-full text-white"
            :class="curColorTheme"
          >
            <p class="text-xl">{{ channelAbbr }}</p>
          </div>
          <p class="font-semibold">{{ channel.title }}</p>
        </template>
        <div class="flex items-center justify-center gap-4">
          <div
            v-if="channel.channelType !== 'SNG'"
            class="group flex flex-col items-center justify-center gap-2"
          >
            <VIconButton
              @click="openMemberInvite"
              :disabled="channel.archivedAt !== undefined"
              icon="./src/assets/images/add.svg"
              :class="{ 'opacity-50': channel.archivedAt }"
              class="border-2 border-indigo-200 bg-indigo-100 group-hover:border-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-800 dark:group-hover:bg-slate-900"
              :invert="true"
            />
            <p class="text-sm text-gray-600 dark:text-slate-400">Member</p>
          </div>
          <div class="group flex flex-col items-center justify-center gap-2">
            <VIconButton
              :disabled="channel.archivedAt !== undefined"
              @click="openThemeSelector"
              icon="./src/assets/images/theme.svg"
              :class="{ 'opacity-50': channel.archivedAt }"
              class="border-2 border-indigo-200 bg-indigo-100 group-hover:border-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:group-hover:border-slate-800 dark:group-hover:bg-slate-900"
              :invert="true"
            />
            <p class="text-sm text-gray-600 dark:text-slate-400">Theme</p>
          </div>
        </div>
      </div>
      <hr
        class="my-5 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />
      <VSection
        :color="channel.color"
        class="p-5"
        title="Members"
        actionButton="View All"
        @click="openDisplayAllMembers"
      >
        <div class="flex items-center gap-3 p-3">
          <img
            src="@/assets/images/profile.svg"
            class="aspect-square h-8 dark:invert"
          />
          <p>
            {{
              channelUserStore.getChannelUsersCount(channel.id) > 1
                ? `${count} members`
                : `${count} member`
            }}
          </p>
        </div>
      </VSection>
      <hr
        class="my-5 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />
      <VSection
        :color="channel.color"
        class="p-5"
        title="Images"
        :actionButton="images.length ? 'View All' : undefined"
        @click="openDisplayImages"
      >
        <div class="p-3">
          <ul
            class="flex flex-wrap items-start justify-center gap-1 overflow-y-scroll"
            v-if="images.length !== 0"
          >
            <template v-for="image in images.reverse().slice(0, 4)">
              <li v-if="image !== undefined">
                <img
                  class="h-24 w-32 rounded-md border-2 border-slate-200 object-cover dark:border-slate-800"
                  :src="image"
                />
              </li>
            </template>
          </ul>
          <p v-else class="text-center">No images found</p>
        </div>
      </VSection>
      <hr
        class="my-5 border-0 border-b border-b-indigo-200 dark:border-b-slate-800"
      />
    </div>

    <VModal @close="closeDisplayImages" :is-open="stateDisplayImages">
      <VImageViewer :chatImages="images" />
    </VModal>

    <VModal @close="closeMemberInvite" :is-open="stateMemberInvite">
      <VMemberInvitation
        @action="sender && userStore.inviteMember(channel.id, sender)"
        :color="curColorTheme"
        :channel-id="channel.id"
      />
    </VModal>

    <VModal @close="closeThemeSelector" :is-open="stateThemeSelector">
      <VChatColorSelector @color="selectColor" />
    </VModal>

    <VModal @close="closeDisplayAllMembers" :is-open="stateDisplayAllMembers">
      <VDisplayAllMembers :channel-id="channel.id" @close="closeFromProfile" />
    </VModal>
  </div>
</template>

<script lang="ts" setup>
import VSection from "@/components/molecules/VSection.vue";
import VAvatar from "@/components/atoms/VAvatar.vue";
import VIconButton from "@/components/atoms/VIconButton.vue";
import VModal from "@/components/atoms/VModal.vue";
import VChatColorSelector from "@/components/organisms/VChatColorSelector.vue";
import VMemberInvitation from "@/components/organisms/VMemberInvitation.vue";
import VDisplayAllMembers from "@/components/organisms/VDisplayAllMembers.vue";
import VImageViewer from "@/components/organisms/VImageViewer.vue";
import VProfileForm from "@/components/organisms/VProfileForm.vue";
import type { Message } from "@/types/Message";
import type { Channel } from "@/types/Channel";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useChannelUserStore } from "@/stores/useChannelUserStore";

const userStore = useUserStore();
const channelUserStore = useChannelUserStore();
const channelUsersCount = channelUserStore.getChannelUsersCount();

interface VChatInfoProps {
  chatMessages: Message[];
  channel: Channel;
  title: string;
  sender?: string;
}

const images = computed(() => {
  return props.chatMessages
    .map((m) => m.image)
    .filter((img) => img != undefined);
});

const count = computed(() => {
  const userCount = channelUsersCount.value.find(
    (ch) => ch[0] === props.channel.id,
  );

  return userCount ? userCount[1] : 0;
});

const channelAbbr = computed(() => {
  return props.channel.title.slice(0, 1);
});

const curColorTheme = computed(() => {
  return props.channel.color ? props.channel.color : "bg-slate-800";
});

const stateMemberInvite = ref<boolean>(false);
const openMemberInvite = () => (stateMemberInvite.value = true);
const closeMemberInvite = () => (stateMemberInvite.value = false);

const stateThemeSelector = ref<boolean>(false);
const openThemeSelector = () => (stateThemeSelector.value = true);
const closeThemeSelector = () => (stateThemeSelector.value = false);

const stateDisplayAllMembers = ref<boolean>(false);
const openDisplayAllMembers = () => (stateDisplayAllMembers.value = true);
const closeDisplayAllMembers = () => (stateDisplayAllMembers.value = false);
const closeFromProfile = (isOpen: boolean) =>
  (stateDisplayAllMembers.value = isOpen);

const stateDisplayImages = ref<boolean>(false);
const openDisplayImages = () => (stateDisplayImages.value = true);
const closeDisplayImages = () => (stateDisplayImages.value = false);

const stateDisplayProfile = ref<boolean>(false);
const openDisplayProfile = () => (stateDisplayProfile.value = true);
const closeDisplayProfile = () => (stateDisplayProfile.value = false);

const selectColor = async (color: string) => {
  stateThemeSelector.value = false;
  (await channelUserStore.setChannelColor(props.channel, color)) &&
    emits("colorUpdate", color);
};

const props = defineProps<VChatInfoProps>();

const emits = defineEmits<{
  colorUpdate: [value: string];
}>();
</script>
