<template>
  <div
    class="bg-(--ui-block-background) px-6 py-4 rounded-4xl flex flex-col gap-4 md:w-[600px] w-full border border-default"
    :class="{ 'md:w-full': chatId }"
  >
    <textarea
      ref="textarea"
      v-model="prompt"
      rows="1"
      :placeholder="$t('chat.promptPlaceholder')"
      :aria-label="$t('chat.promptLabel')"
      class="text-(--ui-text-primary) md:text-base text-sm outline-none border-none transition-all resize-none bg-transparent custom-scrollbar md:max-h-[60vh] max-h-[25vh]"
      :class="{ 'md:h-6': !prompt }"
      @input="autoResize"
    />
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <UiSelector
          v-model="selectedModel"
          :options="options"
          :direction="chatId ? 'up' : 'down'"
        />
        <button
          class="p-3 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center w-fit rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all border border-default"
          type="button"
          :aria-label="$t('chat.addAttachment')"
          :title="$t('chat.addAttachment')"
        >
          <Icon name="lucide:plus" />
        </button>
      </div>
      <button
        class="p-3 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center w-fit rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-default border border-default"
        :disabled="!prompt"
        type="button"
        :aria-label="$t('chat.send')"
        @click="sendRequest"
      >
        <Icon name="lucide:send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUIStore } from "~/stores/ui";
import { useChatStore } from "~/stores/chat";
import type { ChatMessage } from "~/types/gemini";

const uiStore = useUIStore();
const chatStore = useChatStore();
const { selectedModel } = storeToRefs(uiStore);

const props = defineProps<{
  chatId?: number;
}>();

const prompt = ref("");
const textarea = ref<HTMLTextAreaElement | null>(null);

const sendRequest = async () => {
  if (!prompt.value) return;

  const userMessage: ChatMessage = {
    id: Date.now(),
    role: "user",
    parts: [{ text: prompt.value }],
    timestamp: new Date().toISOString(),
    status: "pending",
    model: selectedModel.value,
  };

  const originalPrompt = prompt.value;
  prompt.value = "";

  try {
    const targetId = await chatStore.sendMessage(userMessage, props.chatId);
    if (!props.chatId) {
      await navigateTo(`/chat/${targetId}`);
    }
  } catch (error) {
    prompt.value = originalPrompt;
    console.error("Failed to send message:", error);
  }
};
const autoResize = () => {
  if (textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height = textarea.value.scrollHeight + "px";
  }
};

watch(prompt, (newVal) => {
  if (!newVal) {
    if (textarea.value) textarea.value.style.height = "";
  }
});

const options = [
  { label: "Gemini 3 Flash", value: "gemini-3-flash-preview" },
  { label: "Gemini 3 Pro", value: "gemini-3-pro-preview" },
  { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash" },
  { label: "Gemini 2.5 Flash Lite", value: "gemini-2.5-flash-lite" },
  { label: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
];
</script>
