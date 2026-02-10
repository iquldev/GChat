<template>
  <motion.div layout class="h-full w-full flex flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 py-4">
      <Message
        v-for="message in currentChat?.content"
        :key="message.id"
        :message="message"
      />
    </div>
    <div class="p-4 flex justify-center">
      <NewChat :chatId="currentChat?.id" />
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";
import { motion } from "motion-v";
import Message from "~/components/chat/message.vue";

const route = useRoute();
const chatStore = useChatStore();
const { chats } = storeToRefs(chatStore);
const { changeSelected } = chatStore;

const currentChat = computed(() => {
  return chats.value.find((c) => c.id === Number(route.params.id));
});

onMounted(() => {
  if (route.params.id) {
    changeSelected(Number(route.params.id));
  }
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      changeSelected(Number(newId));
    }
  },
);
</script>
