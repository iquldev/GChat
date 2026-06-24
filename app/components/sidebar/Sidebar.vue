<template>
  <motion.div
    class="bg-(--ui-block-background) rounded-4xl md:p-4 p-6 md:w-fit w-full md:h-full overflow-hidden border border-default"
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
        class="flex-1 overflow-y-auto custom-scrollbar"
        :class="{ 'max-h-[280px] md:max-h-none': isMobile }"
      >
        <template v-if="isMounted">
          <SidebarChatList
            :chats="visibleChats"
            :change-selected="handleChangeSelected"
            :is-sidebar-expanded="isSidebarExpanded"
          />
        </template>
        <div v-else class="flex flex-col gap-2 px-2">
          <div
            v-for="i in 5"
            :key="i"
            class="h-10 w-full bg-(--ui-text-second)/10 rounded-full animate-pulse"
          />
        </div>
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
import { motion } from 'motion-v';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import { useUIStore } from '~/stores/ui';
import { useChatStore } from '~/stores/chat';
import { storeToRefs } from 'pinia';

const uiStore = useUIStore();
const chatStore = useChatStore();

const { isSidebarExpanded, isSearchActive, searchQuery } = storeToRefs(uiStore);
const { toggleSidebar, toggleSearch } = uiStore;
const { chats } = storeToRefs(chatStore);
const { changeSelected, removeSelection } = chatStore;

const isMobile = useBreakpoints(breakpointsTailwind).smallerOrEqual('md');
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const visibleChats = computed(() => {
  return chats.value
    .filter((chat) => {
      return chat.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    })
    .sort((a, b) => {
      const lastMsgA = a.content[a.content.length - 1];
      const lastMsgB = b.content[b.content.length - 1];
      const timeA = lastMsgA ? new Date(lastMsgA.timestamp).getTime() : 0;
      const timeB = lastMsgB ? new Date(lastMsgB.timestamp).getTime() : 0;
      if (timeA === 0 && timeB === 0) return b.id - a.id;
      return timeB - timeA;
    });
});

const router = useRouter();

const handleChangeSelected = (id: number) => {
  changeSelected(id);
  router.push(`/chat/${id}`);
};

const newChatHandler = async () => {
  await removeSelection();
  router.push('/');
};
</script>
