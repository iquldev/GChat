<template>
  <motion.div
    class="group flex items-center justify-between px-4 py-2 rounded-full hover:cursor-pointer transition-all border w-full"
    :class="{
      'bg-(--ui-background) border-default': isSelected,
      'text-(--ui-text-second) border-transparent hover:bg-(--ui-background)/50':
        !isSelected,
    }"
  >
    <p class="truncate flex-1">
      {{ title }}
    </p>
    <button
      class="opacity-0 group-hover:opacity-100 size-8 flex items-center justify-center rounded-full border border-(--ui-code-copy-border) bg-(--ui-code-copy-bg) text-(--ui-text-second) hover:bg-(--ui-code-copy-hover-bg) hover:border-(--ui-code-copy-hover-border) hover:scale-108 active:scale-90 transition-all ml-2 cursor-pointer shrink-0 shadow-sm"
      :title="$t('chat.delete')"
      @click.stop="chatStore.deleteChat(id)"
    >
      <Icon name="lucide:trash-2" class="size-4" />
    </button>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { useChatStore } from "~/stores/chat";

const chatStore = useChatStore();

defineProps<{
  id: number;
  title: string;
  isSelected?: boolean;
}>();
</script>
