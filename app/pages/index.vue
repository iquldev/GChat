<template>
  <div class="relative h-full w-full px-4">
    <HomepageBackground />
    <HomepageChatBlock class="h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat';

const chatStore = useChatStore();

onMounted(() => {
  chatStore.removeSelection();
});
</script>
