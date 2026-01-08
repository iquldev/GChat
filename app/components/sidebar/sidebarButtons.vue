<template>
  <motion.div
    class="flex items-center justify-between w-full gap-y-4"
    :class="{ 'md:flex-col flex-row': isSidebarExpanded }"
    :transition="{ ease: ['easeIn', 'easeOut'] }"
    layout
  >
    <SidebarButton icon="lucide:settings" />
    <SidebarButton icon="lucide:search" @click="toggleSearch" />
    <SidebarButton icon="lucide:message-square-plus" @click="newChatHandler" />
    <SidebarButton
      :icon="
        !isMobile
          ? 'lucide:sidebar'
          : isSidebarExpanded
          ? 'lucide:arrow-up'
          : 'lucide:arrow-down'
      "
      @click="toggleSidebar"
    />
  </motion.div>
</template>

<script lang="ts" setup>
import { motion } from "motion-v";
import SidebarButton from "./sidebarButton.vue";

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
