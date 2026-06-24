<template>
  <span class="text-[11px] text-(--ui-text-second) opacity-80">{{ formatted }}</span>
</template>

<script setup lang="ts">
import { formatChatMessageDate } from '~/utils/formatters';
const props = defineProps({
  timestamp: { type: String, required: true },
});
const { locale, t } = useI18n();

const formatted = computed(() =>
  formatChatMessageDate(props.timestamp, locale.value, {
    today: t('chat.date.today'),
    yesterday: t('chat.date.yesterday'),
  }),
);
</script>
