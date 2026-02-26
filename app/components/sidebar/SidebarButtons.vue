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
    <SidebarButton icon="lucide:settings" @click="toggleSettings(true)" />
    <SidebarButton icon="lucide:search" @click="toggleSearch" />
    <SidebarButton icon="lucide:message-square-plus" @click="newChatHandler" />
    <client-only>
      <SidebarButton
        v-if="isMobile"
        :icon="isSidebarExpanded ? 'lucide:arrow-up' : 'lucide:arrow-down'"
        @click="toggleSidebar"
      />
      <SidebarButton v-else icon="lucide:sidebar" @click="toggleSidebar" />
      <template #fallback>
        <SidebarButton icon="lucide:sidebar" @click="toggleSidebar" />
      </template>
    </client-only>
  </motion.div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";

const toggleSettings = inject("toggleSettings") as (value?: boolean) => void;

defineProps<{
  isSidebarExpanded: boolean;
  newChatHandler: () => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  isMobile: boolean;
}>();
</script>
