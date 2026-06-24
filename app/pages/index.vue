<template>
  <div class="relative h-full w-full px-4">
    <HomepageBackground />
    <HomepageHero class="h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat';
import HomepageHero from '~/components/homepage/HomepageHero.vue';

const chatStore = useChatStore();

onMounted(() => {
  chatStore.removeSelection();
});
</script>
