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
      <SidebarActions
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
          <ChatList
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
      <ChatList
        v-else
        :chats="visibleChats"
        :change-selected="handleChangeSelected"
        :is-sidebar-expanded="isSidebarExpanded"
      />

      <div
        v-if="session?.value?.data?.user"
        class="border-t border-default pt-4 flex flex-col gap-2"
      >
        <div
          class="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-(--ui-button-selected) transition cursor-pointer"
          @click="toggleSettings(true)"
        >
          <img
            v-if="session?.value?.data?.user?.image"
            :src="session?.value?.data?.user?.image"
            class="w-8 h-8 rounded-full object-cover ring-1 ring-(--ui-primary)/50"
            alt="Avatar"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-sm"
          >
            {{
              session?.value?.data?.user?.name?.slice(0, 2).toUpperCase() || 'U'
            }}
          </div>

          <div v-if="!isSidebarExpanded" class="flex-1 min-w-0 text-left">
            <p class="text-sm font-semibold truncate text-(--ui-text-primary)">
              {{ session?.value?.data?.user?.name || 'User' }}
            </p>
            <p class="text-[10px] text-(--ui-text-second) truncate">
              {{ session?.value?.data?.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import { useUIStore } from '~/stores/ui';
import { useChatStore } from '~/stores/chat';
import { storeToRefs } from 'pinia';

import { createAuthClient } from 'better-auth/client';

import ChatList from './ChatList.vue';
import SidebarActions from './SidebarActions.vue';

const uiStore = useUIStore();
const chatStore = useChatStore();
const toggleSettings = inject('toggleSettings') as (value?: boolean) => void;

const { isSidebarExpanded, isSearchActive, searchQuery } = storeToRefs(uiStore);
const { toggleSidebar, toggleSearch } = uiStore;
const { chats } = storeToRefs(chatStore);
const { changeSelected, removeSelection } = chatStore;

const isMobile = useBreakpoints(breakpointsTailwind).smallerOrEqual('md');
const isMounted = ref(false);

const authClient = createAuthClient();
const session = authClient.useSession;

const router = useRouter();

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

const handleChangeSelected = (id: number) => {
  changeSelected(id);
  router.push(`/chat/${id}`);
};

const newChatHandler = async () => {
  await removeSelection();
  router.push('/');
};
</script>
