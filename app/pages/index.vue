<template>
  <ChatBlock class="h-full w-full" />
</template>

<script setup lang="ts">
import ChatBlock from "~/components/homepage/chatBlock.vue";
import { useChatStore } from "~/stores/chat";

const chatStore = useChatStore();

onMounted(() => {
  chatStore.removeSelection();
});
</script>
