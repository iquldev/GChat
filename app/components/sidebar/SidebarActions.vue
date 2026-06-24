<template>
  <motion.div
    class="grid w-full gap-4 shrink-0 justify-items-center items-center"
    :class="isMobile || !isSidebarExpanded ? 'grid-cols-4' : 'grid-cols-1'"
    layout
    :animate="{
      filter: ['blur(4px)', 'blur(0px)'],
    }"
    :transition="{
      layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      filter: { duration: 0.4 },
    }"
  >
    <IconButton icon="lucide:settings" @click="toggleSettings(true)" />
    <IconButton icon="lucide:search" @click="toggleSearch" />
    <IconButton icon="lucide:message-square-plus" @click="newChatHandler" />
    <client-only>
      <IconButton
        v-if="isMobile"
        :icon="isSidebarExpanded ? 'lucide:arrow-up' : 'lucide:arrow-down'"
        @click="toggleSidebar"
      />
      <IconButton v-else icon="lucide:sidebar" @click="toggleSidebar" />
      <template #fallback>
        <IconButton icon="lucide:sidebar" @click="toggleSidebar" />
      </template>
    </client-only>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import IconButton from '../ui/IconButton.vue';

const toggleSettings = inject('toggleSettings') as (value?: boolean) => void;

defineProps<{
  isSidebarExpanded: boolean;
  newChatHandler: () => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  isMobile: boolean;
}>();
</script>
