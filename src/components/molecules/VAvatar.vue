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

const PropSchema = z.object({
  image: z.string().optional(),
  type: z.string().optional(),
  size: SizeSchema.optional(),
  status: z.enum(["online", "offline"]).optional(),
})

interface Prop {
  image?: string
  type?: string
  size?: string
  status?: string
}

const prop = defineProps<Partial<Prop>>()

try {
  PropSchema.parse({
    image: prop.image,
    type: prop.type,
    size: prop.size,
    status: prop.status,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
