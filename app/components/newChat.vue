<template>
  <div
    class="bg-(--ui-sidebar-background) px-6 py-4 rounded-4xl flex flex-col gap-4 md:w-[600px] w-full"
    :class="{ 'md:w-full': chatId }"
  >
    <textarea
      ref="textarea"
      v-model="prompt"
      rows="1"
      :placeholder="$t('chat.promptPlaceholder')"
      :aria-label="$t('chat.promptLabel')"
      class="text-(--ui-text-primary) md:text-base text-sm outline-none border-none transition-all resize-none bg-transparent scrollbar-hide md:max-h-[60vh] max-h-[25vh]"
      :class="{ 'md:h-6': !prompt }"
      @input="autoResize"
    />
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Selector :options="options" v-model="selectedModel" />
        <button
          class="p-3 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center w-fit rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all"
        >
          <Icon name="lucide:plus" />
        </button>
      </div>
      <button
        class="p-3 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center w-fit rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-default"
        :disabled="!prompt"
      >
        <Icon name="lucide:send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUIStore } from "~/stores/ui";
import Selector from "~/components/selector.vue";

const uiStore = useUIStore();
const { selectedModel } = storeToRefs(uiStore);
const { t } = useI18n();

const props = defineProps({
  chatId: {
    type: Number,
    required: false,
  },
});

const prompt = ref("");
const textarea = ref<HTMLTextAreaElement | null>(null);

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
  { label: "Gemini 3 Flash", value: "gemini-3-flash" },
  { label: "Gemini 3 Pro", value: "gemini-3-pro" },
];
</script>
