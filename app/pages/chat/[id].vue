<template>
  <div class="h-full w-full flex flex-col p-4">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-(--ui-text-primary)">
        Chat: {{ currentChat?.title || "Unknown Chat" }}
      </h2>
      <p class="text-(--ui-text-second)">ID: {{ route.params.id }}</p>
    </div>

    <div
      class="flex-1 bg-(--ui-background) rounded-3xl p-6 border border-white/5 overflow-y-auto"
    >
      <div class="text-(--ui-text-second) italic">
        Messages for chat {{ route.params.id }} will be here...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

const route = useRoute();
const chatStore = useChatStore();
const { chats } = storeToRefs(chatStore);

const currentChat = computed(() => {
  return chats.value.find((c) => c.id === Number(route.params.id));
});
</script>
