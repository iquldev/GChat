<template>
  <motion.div
    layout
    class="flex flex-col h-full w-full items-center justify-center gap-8"
  >
    <h1 class="text-5xl font-bold text-(--ui-text-primary) select-none">
      GChat
    </h1>
    <NewChat />
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
</script>
