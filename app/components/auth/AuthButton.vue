<template>
  <button
    :disabled="disabled"
    class="md:w-96 w-78 bg-(--ui-text-primary) text-(--ui-background) md:text-xl text-md flex justify-between items-center p-3 rounded-full cursor-pointer hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
    @click="onClick"
  >
    <Icon :name="provider.logo" class="md:size-8 size-6" />
    <span>{{ t('auth.loginWith') }} {{ provider.name }}</span>
    <div />
  </button>
</template>

<script setup lang="ts">
import type { Provider } from '~/types/auth';
const { t } = useI18n();

defineProps<{
  provider: Provider;
  onClick?: () => void;
  disabled?: boolean;
}>();
</script>
