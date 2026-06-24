<template>
  <div class="text-[11px] flex gap-2 w-full px-1" :class="role === 'user' ? 'justify-end' : 'justify-start'">
    <div class="font-medium text-(--ui-text-second) opacity-70 flex gap-2 items-center">
      <span class="uppercase tracking-wider">{{ sender }}</span>
      <template v-if="message.status">
        <span class="opacity-30">•</span>
        <Icon
          v-if="message.status !== 'received' && message.status !== 'streaming'"
          :name="status"
          class="shrink-0 size-3.5"
          :class="[statusColor, { 'animate-spin': message.status === 'pending' }]"
        />
        <span v-else-if="message.status === 'received' || message.status === 'streaming'" class="message-status-text shrink-0 opacity-80">{{ status }}</span>
      </template>
      <span class="opacity-30">•</span>
      <Timestamp :timestamp="message.timestamp" />
    </div>

    <div class="text-(--ui-text-second) flex gap-1 items-center" :class="role === 'user' ? 'mr-auto' : 'ml-auto'">
      <button v-if="message.status === 'error' && message.role === 'model'" class="opacity-70 flex items-center justify-center p-1.5 rounded-md hover:bg-(--ui-block-background) hover:opacity-100 transition-all cursor-pointer" :title="t('chat.retry')" @click="$emit('retry')">
        <Icon name="lucide:rotate-cw" class="size-4" />
      </button>
      <button v-if="message.role === 'model'" class="opacity-70 flex items-center justify-center p-1.5 rounded-md hover:bg-(--ui-block-background) hover:opacity-100 transition-all cursor-pointer" :title="t('chat.copy')" @click="$emit('copy')">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types/openrouter';
import Timestamp from '../ui/Timestamp.vue';
defineEmits<['retry'|'copy']>();

defineProps<{ 
  message: ChatMessage;
  role: string;
  sender: string;
  status: string;
  statusColor: string;
  copied: boolean;
}>();

const { t } = useI18n();
</script>