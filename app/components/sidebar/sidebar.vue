<template>
  <motion.div
    class="bg-(--ui-sidebar-background) rounded-4xl md:p-4 p-6 md:w-fit w-full md:h-full overflow-hidden overflow-y-scroll"
    :class="{
      'rounded-full': isSidebarExpanded,
      'h-fit': isSidebarExpanded,
    }"
    layout
    :initial="{ filter: 'blur(5px)' }"
    :animate="{ filter: 'blur(0px)' }"
    :while-layout="{ filter: 'blur(5px)' }"
  >
    <motion.div class="flex flex-col gap-4 h-fit" layout>
      <sidebarButtons
        :isSidebarExpanded="isSidebarExpanded"
        :newChatHandler="newChatHandler"
        :toggleSidebar="toggleSidebar"
        :toggleSearch="toggleSearch"
        :isMobile="isMobile"
      />
      <sidebarSearch
        v-model:searchQuery="searchQuery"
        v-if="isSearchActive && !isSidebarExpanded"
      />
      <sidebarChatList
        :chats="visibleChats"
        :changeSelected="handleChangeSelected"
        :isSidebarExpanded="isSidebarExpanded"
      />
    </motion.div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import sidebarButtons from "./sidebarButtons.vue";
import sidebarSearch from "./sidebarSearch.vue";
import sidebarChatList from "./sidebarChatList.vue";
import { useUIStore } from "~/stores/ui";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

const uiStore = useUIStore();
const chatStore = useChatStore();

const { isSidebarExpanded, isHomeScreen, isSearchActive, searchQuery } =
  storeToRefs(uiStore);
const { toggleSidebar, toggleSearch, setHomeScreen } = uiStore;
const { chats } = storeToRefs(chatStore);
const { changeSelected, removeSelection } = chatStore;

const isMobile = useBreakpoints(breakpointsTailwind).smallerOrEqual("md");

const visibleChats = computed(() => {
  return chats.value.filter((chat) => {
    return chat.title.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const handleChangeSelected = (id: number) => {
  changeSelected(id);
  setHomeScreen(false);
};

const newChatHandler = async () => {
  await removeSelection();
  setHomeScreen(true);
};
</script>
