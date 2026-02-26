<template>
  <motion.div
    class="bg-(--ui-block-background) rounded-4xl md:p-4 p-6 md:w-fit w-full md:h-full overflow-hidden"
    :class="{
      'rounded-full': isSidebarExpanded,
      'h-fit': isSidebarExpanded,
    }"
    layout
    :initial="{ filter: 'blur(0px)', opacity: 1 }"
    :animate="{
      filter: ['blur(8px)', 'blur(0px)'],
      opacity: 1,
    }"
    :transition="{
      layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      filter: { duration: 0.4 },
    }"
  >
    <motion.div
      class="flex flex-col gap-4"
      :class="isSidebarExpanded ? 'h-fit' : 'h-full min-h-0'"
      layout
    >
      <SidebarButtons
        :is-sidebar-expanded="isSidebarExpanded"
        :new-chat-handler="newChatHandler"
        :toggle-sidebar="toggleSidebar"
        :toggle-search="toggleSearch"
        :is-mobile="isMobile"
      />
      <Transition
        enter-active-class="animate-fade-in"
        leave-active-class="animate-fade-out"
      >
        <SidebarSearch
          v-if="isSearchActive && !isSidebarExpanded"
          v-model:search-query="searchQuery"
        />
      </Transition>
      <div
        v-if="!isSidebarExpanded"
        class="flex-1 overflow-y-auto scrollbar-hide"
        :class="{ 'max-h-[280px] md:max-h-none': isMobile }"
      >
        <SidebarChatList
          :chats="visibleChats"
          :change-selected="handleChangeSelected"
          :is-sidebar-expanded="isSidebarExpanded"
        />
      </div>
      <SidebarChatList
        v-else
        :chats="visibleChats"
        :change-selected="handleChangeSelected"
        :is-sidebar-expanded="isSidebarExpanded"
      />
    </motion.div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import { useUIStore } from "~/stores/ui";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

const uiStore = useUIStore();
const chatStore = useChatStore();

const { isSidebarExpanded, isSearchActive, searchQuery } = storeToRefs(uiStore);
const { toggleSidebar, toggleSearch } = uiStore;
const { chats } = storeToRefs(chatStore);
const { changeSelected, removeSelection } = chatStore;

const isMobile = useBreakpoints(breakpointsTailwind).smallerOrEqual("md");

const visibleChats = computed(() => {
  return chats.value.filter((chat) => {
    return chat.title.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const router = useRouter();

const handleChangeSelected = (id: number) => {
  changeSelected(id);
  router.push(`/chat/${id}`);
};

const newChatHandler = async () => {
  await removeSelection();
  router.push("/");
};
</script>
