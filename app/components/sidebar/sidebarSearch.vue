<template>
  <motion.input
    type="text"
    placeholder="Search..."
    class="w-full px-4 py-2 rounded-full bg-(--ui-background) outline-none border-none"
    :value="searchQuery"
    @input="searchQuery = ($event.target as HTMLInputElement).value"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
  />
</template>

<script lang="ts" setup>
import { motion } from "motion-v";

const searchQuery = defineModel("searchQuery", {
  type: String,
  required: true,
});
</script>
