<template>
  <div
    class="bg-(--ui-sidebar-background) px-6 py-4 rounded-4xl flex flex-col gap-4"
  >
    <input
      v-model="prompt"
      type="text"
      placeholder="Enter your prompt..."
      class="text-(--ui-text-primary) md:text-base text-sm outline-none border-none transition-all"
    />
    <div class="flex items-center justify-between md:w-96 gap-2">
      <div class="flex items-center gap-2">
        <Selector :options="options" v-model="model" />
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
import Selector from "../settings/selector.vue";

const model = ref("gemini-2.5-flash");
const prompt = ref("");

const options = [
  { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash" },
  { label: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
];
</script>
