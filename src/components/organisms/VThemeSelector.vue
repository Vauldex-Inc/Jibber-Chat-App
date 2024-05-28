<template>
	<VIconButton 
			v-if="theme === 'light'" 
			@click="setTheme('dark')"  
			:rounded="true"
			icon="./src/assets/images/sun.svg" 
			class="bg-slate-200"/>
	<VIconButton 
			v-else @click="setTheme('light')" 
			icon="./src/assets/images/moon.svg" 
			:rounded="true"
			class="bg-slate-800"/>
</template>

<script lang="ts" setup>
import VIconButton from "@/components/atoms/VIconButton.vue"
import {useTheme} from "@/composables/useTheme"

const {setTheme,getTheme} = useTheme()

const theme = getTheme()

</script>