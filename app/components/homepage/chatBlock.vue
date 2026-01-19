<template>
  <motion.div
    layout
    :transition="{
      layout: { type: 'spring', stiffness: 300, damping: 30 },
    }"
    class="flex flex-col h-full w-full items-center justify-center gap-8"
  >
    <h1 class="text-5xl font-bold text-(--ui-text-primary)">GChat</h1>
    <NewChat />
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import NewChat from "./newChat.vue";
</script>
