<template>
  <div :class="['avatar', sizeClass]">
    <img v-if="src" :src="src" :alt="alt || 'avatar'" class="object-cover rounded-full" />
    <div v-else class="bg-(--ui-background) rounded-full flex items-center justify-center text-(--ui-text-second)">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: { type: String, required: false, default: '' },
  alt: { type: String, required: false, default: '' },
  size: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
});

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'w-8 h-8';
  if (props.size === 'lg') return 'w-12 h-12';
  return 'w-10 h-10';
});
</script>
