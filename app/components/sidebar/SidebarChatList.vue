<template>
  <motion.div
    v-if="!isSidebarExpanded"
    class="md:w-64 w-full flex flex-col gap-2"
  >
    <SidebarChat
      v-for="chatItem in chats"
      :id="chatItem.id"
      :key="chatItem.id"
      :title="chatItem.title"
      :is-selected="chatItem.id === selectedChatId"
      @click="changeSelected(chatItem.id)"
    />
  </motion.div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

interface chat {
  id: number;
  title: string;
}

const chatStore = useChatStore();
const { selectedChatId } = storeToRefs(chatStore);

defineProps({
  isSidebarExpanded: {
    type: Boolean,
    required: true,
  },
  chats: {
    type: Array<chat>,
    required: true,
  },
  changeSelected: {
    type: Function,
    required: true,
  },
});
</script>
