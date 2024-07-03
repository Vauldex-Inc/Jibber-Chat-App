import { ref } from 'vue'

export const useModal = () => {
  const stateMemberInvite = ref<boolean>(false)
  const stateThemeSelector = ref<boolean>(false)
  const stateDisplayAllMembers = ref<boolean>(false)
  const stateDisplayImages = ref<boolean>(false)
  const stateDisplayProfile = ref<boolean>(false)

  const toggle = (state: string) => {
    switch (state) {
      case "stateMemberInvite":
        stateMemberInvite.value = !stateMemberInvite.value
        break;

      case "stateThemeSelector":
        stateThemeSelector.value = !stateThemeSelector.value
        break;

      case "stateDisplayAllMembers":
        stateDisplayAllMembers.value = !stateDisplayAllMembers.value
        break;

      case "stateDisplayImages":
        stateDisplayImages.value = !stateDisplayImages.value
        
        break;

      case "stateDisplayProfile":
        stateDisplayProfile.value = !stateDisplayProfile.value
        
        break;
    
      default:
        break;
    }
  }

  return {
    stateMemberInvite,
    stateThemeSelector,
    stateDisplayAllMembers,
    stateDisplayImages,
    stateDisplayProfile,
    toggle
  }
}