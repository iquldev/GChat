<template>
  <motion.div layout class="h-full w-full flex flex-col justify-end">
    <NewChat :chatId="Number(route.params.id)" />
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
