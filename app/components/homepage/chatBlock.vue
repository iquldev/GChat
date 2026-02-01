<template>
  <motion.div
    layout
    class="flex flex-col h-full w-full items-center justify-center gap-8"
    :initial="{ filter: 'blur(5px)' }"
    :animate="{ filter: 'blur(0px)' }"
    :while-layout="{ filter: 'blur(5px)' }"
  >
    <h1 class="text-5xl font-bold text-(--ui-text-primary) select-none">
      GChat
    </h1>
    <NewChat />
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import NewChat from "./newChat.vue";
</script>
