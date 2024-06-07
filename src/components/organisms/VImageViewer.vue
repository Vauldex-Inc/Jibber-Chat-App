<template>
	<div class="w-screen flex items-center justify-center relative h-screen bg-slate-900/70">
		<img class="p-1 rounded-md" :src="chatImages[count]">
		<div class="absolute left-5">
			<VIconButton tool-tip="previous" size="lg" @click="leftMove" icon="./src/assets/images/left-button.svg"/>
		</div>
		<div class="absolute right-5">
			<VIconButton tool-tip="next" size="lg" @click="rightMove" icon="./src/assets/images/right-button.svg"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import VIconButton from '@/components/atoms/VIconButton.vue'
import { ref, computed } from 'vue'

const props = defineProps<{
	chatImages: string[]
}>()

const count = ref<number>(0)

const rightMove = () => {
	if(count.value >= props.chatImages.length - 1) {
		count.value = 0
	} else {
		count.value++
	}
}

const leftMove = () => {
	if(count.value <= 0) {
		count.value = props.chatImages.length - 1
	} else {
		count.value--
	}
}

</script>