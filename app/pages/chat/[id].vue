<template>
  <motion.div layout class="h-full w-full flex flex-col overflow-hidden">
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 py-4"
      @scroll="handleScroll"
    >
      <ChatMessage
        v-for="message in currentChat?.content"
        :key="message.id"
        :message="message"
      />
    </div>
    <div class="flex justify-center">
      <NewChat :chat-id="chatId" />
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";
import { motion } from "motion-v";

const route = useRoute();
const chatStore = useChatStore();
const { chats } = storeToRefs(chatStore);
const { changeSelected } = chatStore;

const chatId = computed(() => Number(route.params.id));
const scrollContainer = ref<HTMLElement | null>(null);
const shouldAutoScroll = ref(true);

const currentChat = computed(() => {
  return chats.value.find((c) => c.id === chatId.value);
});

const scrollToBottom = async () => {
  if (shouldAutoScroll.value && scrollContainer.value) {
    await nextTick();
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
  const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

  if (isAtBottom) {
    shouldAutoScroll.value = true;
  } else {
    shouldAutoScroll.value = false;
  }
};

watch(
  () => currentChat.value?.content,
  () => {
    scrollToBottom();
  },
  { deep: true, immediate: true },
);

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
