<template>
  <div
    class="md:p-12 p-8 flex flex-col md:gap-12 gap-8 items-center bg-(--ui-block-background)/70 rounded-3xl border-default backdrop-blur-xl"
  >
    <h1 class="text-2xl md:text-3xl text-center">{{ title }}</h1>

    <div class="flex flex-col gap-4">
      <AuthButton
        v-for="provider in providers"
        :key="provider.id"
        :provider="provider"
        @click="$emit('auth', provider.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Provider } from '~/types/auth';

defineProps<{
  title: string;
  providers: Provider[];
}>();

defineEmits<{
  auth: [provider: string];
}>();
</script>
