<template>
  <HomepageChatBlock class="h-full w-full" />
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/chat";

const chatStore = useChatStore();

onMounted(() => {
  chatStore.removeSelection();
});
</script>
