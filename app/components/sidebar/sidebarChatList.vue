<template>
  <motion.div
    v-if="!isSidebarExpanded"
    class="md:w-64 w-full flex flex-col gap-2"
  >
    <sidebarChat
      v-for="chat in chats"
      :key="chat.id"
      :title="chat.title"
      :is-selected="chat.id === selectedChatId"
      :id="chat.id"
      @click="changeSelected(chat.id)"
    ></sidebarChat>
  </motion.div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";
import sidebarChat from "./sidebarChat.vue";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

interface chat {
  id: number;
  title: string;
}

const chatStore = useChatStore();
const { selectedChatId } = storeToRefs(chatStore);

const props = defineProps({
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
