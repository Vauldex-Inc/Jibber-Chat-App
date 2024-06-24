<template>
  <form
    @submit.prevent="create"
    class="flex w-96 max-w-full flex-col justify-center gap-3 rounded-lg bg-white p-5 shadow-md dark:bg-slate-900"
  >
    <div
      class="relative flex justify-center"
      @mouseenter="onAvatar = true"
      @mouseleave="onAvatar = false"
    >
      <VIconButton
        v-if="viewOnly ? false : true"
        @click="removeImage"
        size="sm"
        rounded
        icon="./src/assets/images/close.svg"
        class="scale-75"
        :class="
          viewOnly
            ? 'hidden'
            : 'absolute bottom-0 right-32 z-20 -translate-x-2 -translate-y-10 bg-red-500 focus:border-indigo-600 dark:focus:border-indigo-600'
        "
        :hidden="!onAvatar"
      />
      <VAvatar
        :image="
          formData.image
            ? formData.image
            : './src/assets/images/default-avatar.svg'
        "
        size="lg"
        :status="getStatus(sender)"
      />
      <input
        @change="attachFile"
        hidden
        class="hidden"
        type="file"
        ref="fileInput"
      />
      <VIconButton
        v-if="viewOnly ? false : true"
        @click="openFileSelector"
        size="sm"
        icon="./src/assets/images/edit.svg"
        rounded
        class="absolute bottom-0 right-32 z-20 -translate-x-2 translate-y-0.5 bg-indigo-600 focus:border-indigo-600 dark:bg-slate-700 dark:bg-slate-800 dark:focus:border-indigo-600"
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
      :disabled="viewOnly ? viewOnly : false"
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
      :disabled="viewOnly ? viewOnly : false"
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
      :disabled="viewOnly ? viewOnly : false"
    />
    <label for="email">Email</label>
    <VInput
      id="email"
      size="md"
      v-model.trim="formData.email"
      class="rounded-md border-2 border-gray-300 bg-gray-50 outline-none dark:border-slate-700 dark:bg-slate-800"
      :class="
        viewOnly
          ? 'border-gray-300'
          : 'hover:border-indigo-600 focus:border-indigo-600 dark:hover:border-indigo-600 dark:focus:border-indigo-600'
      "
      :disabled="viewOnly ? viewOnly : false"
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
import VAvatar from "@/components/atoms/VAvatar.vue";
import VIconButton from "@/components/atoms/VIconButton.vue";
import VInput from "@/components/atoms/VInput.vue";
import VButton from "@/components/atoms/VButton.vue";

import type { ProfileData, Profile } from "@/types/Profile.ts";
import type { User } from "@/types/User";

import { ref, onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useUserStore } from "@/stores/useUserStore";
import { useUser } from "@/composables/useUser";

const emits = defineEmits<{
  submit: [];
}>();
const props = defineProps<{
  sender?: string;
  viewOnly?: boolean;
}>();

const method = ref<"POST" | "PUT" | undefined>();
const error = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);
const onAvatar = ref<boolean>(false);
const formData = ref<ProfileData>({
  nickName: "",
  firstName: "",
  lastName: "",
  image: "",
  email: "",
});

const currUser = useUser();
const { getUserById, addUserProfile, getStatus } = useUserStore();

const openFileSelector = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// const getStatus = () => {
//   return getOnlineUsers().value.indexOf(props.sender) !== -1
//     ? "online"
//     : "offline";
// };

const attachFile = () => {
  const file = fileInput.value.files[0];
  const reader = new FileReader();
  const isImage = /\.(jpe?g|png|gif)$/.test(file.name);

  if (isImage) {
    reader.onload = () => {
      formData.value.image = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  formData.value.image = "";
  fileInput.value.value = "";
};

const create = async () => {
  try {
    const response = await useFetch("/profiles", {
      method: method.value,
      body: JSON.stringify(formData.value),
    });

    if (response.status === 200) {
      if (currUser) {
        const newProfile: Profile = {
          userId: currUser.id,
          nickName: formData.value.nickName,
          firstName: formData.value.firstName,
          lastName: formData.value.lastName,
          image: formData.value.image,
          email: formData.value.email,
        };
        addUserProfile(currUser.id, newProfile);
      }
      emits("submit");
    } else {
      error.value = "Oops, something went wrong.";
    }
  } catch (e) {
    if (typeof e === "string") throw new Error(e);
  } finally {
    setTimeout(() => {
      error.value = "";
    }, 2000);
  }
};

const doesExist = () => {
  if (currUser) {
    const [user, profile]: [User, Profile][] = getUserById(
      props.sender ? props.sender : currUser.id,
    );

    if (profile) {
      method.value = "PUT";
      formData.value.nickName = profile.nickName;
      formData.value.firstName = profile.firstName;
      formData.value.lastName = profile.lastName;
      formData.value.image = profile.image;
      formData.value.email = profile.email;
    } else {
      method.value = "POST";
      formData.value.nickName = user.username;
    }
  }
};

const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus(),
};

onMounted(() => {
  doesExist();
});
</script>
