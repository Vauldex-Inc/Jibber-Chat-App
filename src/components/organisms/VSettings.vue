<template>
  <VModal :is-open="formShown" @close="formShown = false">
    <VProfileForm @submit="newProfile" />
  </VModal>
  <div class="relative flex items-center">
    <VIconButton
      class="bg-gray-100 dark:bg-slate-900"
      :hasPadding="true"
      size="xl"
      :icon="
        profileImage ? profileImage : './src/assets/images/default-avatar.svg'
      "
      @click="toggleSettings"
      :rounded="true"
    />
    <ul
      @mouseleave="toggleSettings"
      class="absolute left-0 top-0 z-30 flex w-[220px] translate-y-14 flex-col rounded-md bg-white shadow-xl dark:bg-slate-800"
      v-if="isOpen"
    >
      <li
        class="hover:rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
        @click="formShown = true"
      >
        <VButton class="flex w-full items-center gap-3" @click="isOpen = false">
          <img
            class="aspect-square h-7"
            src="@/assets/images/default-avatar.svg"
          />
          <span>Profile</span>
        </VButton>
      </li>
      <li
        class="hover:rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
        @click="toggleSettings"
      >
        <VThemeSelector />
      </li>
      <li
        class="hover:rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
        @click="toggleSettings"
      >
        <VButton class="flex w-full items-center gap-3" @click="logout">
          <img class="aspect-square h-7" src="@/assets/images/logout.svg" />
          <span>Logout</span>
        </VButton>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFetch } from "@/composables/useFetch";

import VIconButton from "@/components/atoms/VIconButton.vue";
import VButton from "@/components/atoms/VButton.vue";
import VThemeSelector from "@/components/organisms/VThemeSelector.vue";
import VModal from "@/components/atoms/VModal.vue";
import VProfileForm from "@/components/organisms/VProfileForm.vue";

import { z } from "zod";
const errorSchema = z.object({
  message: z.string(),
});

const router = useRouter();
const isOpen = ref<boolean>(false);
const formShown = ref<boolean>(false);

defineProps<{
  profileImage?: string | undefined;
  username: string;
}>();

const toggleSettings = () => (isOpen.value = !isOpen.value);

const newProfile = () => (formShown.value = false);

const logout = async () => {
  try {
    const response = await useFetch("/sessions", { method: "DELETE" });
    if (response.status === 200) {
      localStorage.removeItem("user");
      router.push("/");
    }
  } catch (error) {
    const errorMessage = errorSchema.safeParse(error).data?.message;
    throw new Error(`Error: ${errorMessage}`);
  }
};
</script>
