<template>
  <motion.div
    class="flex items-center justify-between w-full gap-y-4"
    :class="{ 'md:flex-col flex-row': isSidebarExpanded }"
    :transition="{ ease: ['easeIn', 'easeOut'] }"
    layout
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
import SidebarButton from "./sidebarButton.vue";

const toggleSettings = inject("toggleSettings") as (value?: boolean) => void;

defineProps({
  isSidebarExpanded: {
    type: Boolean,
    required: true,
  },
  newChatHandler: {
    type: Function,
    required: true,
  },
  toggleSidebar: {
    type: Function,
    required: true,
  },
  toggleSearch: {
    type: Function,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
});
</script>
