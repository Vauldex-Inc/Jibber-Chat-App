<template>
  <div class="relative inline-block">
    <VImage :size="size" :type="type ?? 'avatar'" :source="image" />
    <VUserStatus :status="status" />
  </div>
</template>

<script setup lang="ts">
import { ZodError, z } from "zod"
import VImage from "@/components/atoms/VImage.vue"
import VUserStatus from "@/components/atoms/VUserStatus.vue"
import { SizeSchema } from "@/types/Component"
import type { AvatarProp } from "@/types/Prop"
import { StatusSchema } from "@/types/User"

const prop = defineProps<Partial<AvatarProp>>()

const PropSchema = z.object({
  image: z.string().optional(),
  type: z.string().optional(),
  size: SizeSchema.optional(),
  status: StatusSchema.optional()
})

try {
  PropSchema.parse(prop)
} catch (e) {
  const error = e as ZodError
  console.error(error.message)
}
</script>
