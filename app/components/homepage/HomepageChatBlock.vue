<template>
  <div class="flex items-center justify-center">
    <motion.div
      layout
      class="flex flex-col h-full w-full items-center justify-center gap-8 z-10"
    >
      <div class="flex flex-col items-center gap-4">
        <h1 class="text-5xl font-bold text-(--ui-text-primary) select-none">
          GChat
        </h1>
        <p
          v-if="chatStore.chats.length === 0"
          class="text-(--ui-text-second) opacity-50 text-center max-w-md"
        >
          {{ $t('chat.welcome') }}
        </p>
      </div>
      <NewChat v-model:prompt="homepagePrompt" />
      <div>
        <PromptExamples v-model:prompt="homepagePrompt" />
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { useChatStore } from '~/stores/chat';
import { ref } from 'vue';
import PromptExamples from '~/components/compose/PromptExamplesPanel.vue';
import NewChat from '~/components/compose/NewChatForm.vue';

const chatStore = useChatStore();
const homepagePrompt = ref('');
</script>
