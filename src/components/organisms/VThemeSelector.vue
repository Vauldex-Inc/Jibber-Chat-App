<template>
	<VButton 
			v-if="theme === 'light'" 
			@click="setTheme('dark')"
			class="flex items-center gap-3 w-full"
		>
			<img class="h-7 aspect-square" src="@/assets/images/moon.svg" />
			<span>Theme • ( Light )</span>
	</VButton>
	<VButton 
			v-else 
			@click="setTheme('light')" 
			class="flex items-center gap-3 w-full"
		>
			<img class="h-7 aspect-square" src="@/assets/images/sun.svg" />
			<span>Theme • ( Dark )</span>
	</VButton>
</template>

<script lang="ts" setup>
import VIconButton from "@/components/atoms/VIconButton.vue"
import VButton from "@/components/atoms/VButton.vue"
import {useTheme} from "@/composables/useTheme"

const {setTheme,getTheme} = useTheme()

const theme = getTheme()

</script>