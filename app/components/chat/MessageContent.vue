<template>
  <div
    class="py-4 transition-colors duration-200 wrap-break-word overflow-hidden"
    :class="[
      role === 'user'
        ? 'bg-(--ui-block-background) border border-default shadow-xs px-6 rounded-2xl w-full'
        : 'px-2 md:px-0',
      {
        'disable-blur': isBlurDisabled,
        'no-animation':
          message.status !== 'received' &&
          message.status !== 'streaming' &&
          message.role === 'model',
        'border-(--ui-error)/50 bg-(--ui-error)/10 rounded-2xl px-6':
          message.status === 'error',
      },
    ]"
  >
    <TransitionGroup
      name="stream"
      tag="div"
      class="flex flex-col gap-[0.85rem] md:text-[17px] text-[15px] leading-relaxed wrap-break-word message-body"
      :class="{
        'animate-text-shimmer': message.status === 'pending',
      }"
    >
      <template v-if="message.status === 'pending' && message.role === 'model'">
        <div class="flex flex-col gap-2">
          <div class="h-4 w-48 bg-(--ui-text-second)/20 rounded-sm animate-pulse" />
          <div class="h-4 w-32 bg-(--ui-text-second)/20 rounded-sm animate-pulse" />
        </div>
      </template>

      <div v-if="attachments.length > 0" key="attachments" class="flex flex-wrap gap-2">
        <template v-for="(att, i) in attachments" :key="'att-' + i">
          <img
            v-if="att?.mimeType.startsWith('image/')"
            :src="att.url"
            :alt="`Attachment ${i + 1}`"
            class="max-w-50 h-auto rounded-xl border border-default object-cover cursor-pointer hover:opacity-90 transition-opacity"
            @click="fullscreenImage = att.url"
          />
          <div v-else class="w-50 h-25 rounded-xl border border-default flex flex-col items-center justify-center bg-(--ui-background) text-sm p-2">
            <Icon name="lucide:file" class="w-8 h-8 mb-2 text-(--ui-text-second)" />
            <span class="text-xs text-center font-bold">{{ att?.mimeType.split("/")[1]?.toUpperCase() || 'FILE' }}</span>
          </div>
        </template>
      </div>

      <MarkdownRenderer
        v-for="(para, index) in paragraphs"
        :key="index"
        :content="para"
        :is-streaming="message.status === 'streaming' && index === paragraphs.length - 1"
      />
    </TransitionGroup>

    <Teleport to="body">
      <div v-if="fullscreenImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.self="fullscreenImage = null">
        <button
          class="absolute top-4 right-4 p-3 md:p-4 bg-(--ui-background) flex items-center justify-center w-fit rounded-full border border-default hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all"
          @click="fullscreenImage = null"
        >
          <Icon name="lucide:x" class="w-6 h-6" />
        </button>
        <button
          class="absolute top-4 right-24 p-3 md:p-4 bg-(--ui-background) flex items-center justify-center w-fit rounded-full border border-default hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all"
          @click="downloadImage(fullscreenImage)"
        >
          <Icon name="lucide:download" class="w-6 h-6" />
        </button>
        <img :src="fullscreenImage" class="max-w-full max-h-full object-contain rounded-lg" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import MarkdownRenderer from './MarkdownRenderer.vue';
import type { ChatMessage } from '~/types/openrouter';

defineProps<{
  message: ChatMessage;
  paragraphs: string[];
  attachments: { mimeType: string; url: string }[];
  isBlurDisabled: boolean;
  role: string;
}>();

const fullscreenImage = ref<string | null>(null);

const downloadImage = (url: string | null) => {
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = `attachment-${Date.now()}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>
