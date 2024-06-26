<template>
  <div class="relative inline-block">
    <VImage type="avatar" :source="image"/>
    <VUserStatus :status = "status"/>
  </div>
</template>

<script setup lang="ts">
import { ZodError, z } from "zod"

import { SizeSchema }  from '@/types/Component'
import VImage from '@/components/atoms/VImage.vue'
import VUserStatus from '@/components/atoms/VUserStatus.vue'

const PropSchema = z.object({
  image: z.string().optional(),
  size: SizeSchema.optional(),
  status: z.enum(["online", "offline"]).optional(),
})

interface Prop {
  image: string
  size: string
  status: string
}

const prop = defineProps<Partial<Prop>>()

try {
  PropSchema.parse({
    image: prop.image,
    size: prop.size,
    status: prop.status,
  })
} catch (e) {
  const error = e as ZodError
  console.error(error.issues)
}
</script>
