<template>
  <motion.div
    layout
    class="flex flex-col h-full w-full items-center justify-center gap-8"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-5xl font-bold text-(--ui-text-primary) select-none">
        GChat
      </h1>
      <p
        v-if="chatStore.chats.length === 0"
        class="text-(--ui-text-second) opacity-50 text-center max-w-md"
      >
        {{ $t("chat.welcome") }}
      </p>
    </div>
    <NewChat />
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { useChatStore } from "~/stores/chat";

const chatStore = useChatStore();
</script>
