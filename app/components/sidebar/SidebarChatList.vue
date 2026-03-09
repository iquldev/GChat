<template>
  <motion.div v-if="!isSidebarExpanded" class="w-full flex flex-col gap-2">
    <template v-if="chats.length > 0">
      <SidebarChat
        v-for="chatItem in chats"
        :id="chatItem.id"
        :key="chatItem.id"
        :title="chatItem.title"
        :is-selected="chatItem.id === selectedChatId"
        @click="changeSelected(chatItem.id)"
      />
    </template>
    <motion.div
      v-else
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      class="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <Icon
        name="lucide:message-square-dashed"
        class="size-8 text-(--ui-text-second) opacity-20 mb-2"
      />
      <p class="text-xs text-(--ui-text-second) opacity-50">
        {{ $t("chat.noChats") }}
      </p>
    </motion.div>
  </motion.div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

interface Chat {
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
    type: Array as PropType<Chat[]>,
    required: true,
  },
  changeSelected: {
    type: Function as PropType<(id: number) => void>,
    required: true,
  },
});
</script>
