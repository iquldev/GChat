<template>
  <aside class="md:w-64 w-full flex flex-col border-r border-default bg-(--ui-background)/50">
    <div class="flex items-center gap-3 p-6 border-b border-default">
      <Icon name="lucide:settings" class="size-6 text-(--ui-text-primary)" />
      <h1 class="font-bold text-xl">{{ $t('settings.title') }}</h1>
    </div>

    <nav class="flex-1 p-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium cursor-pointer border"
        :class="activeCategory === cat.id
          ? 'bg-(--ui-background) border-default text-(--ui-text-primary)'
          : 'border-transparent text-(--ui-text-second) hover:bg-(--ui-button-selected)'
        "
        @click="$emit('update:activeCategory', cat.id)"
      >
        <Icon :name="cat.icon" class="size-4 shrink-0" />
        <span>{{ cat.label }}</span>
      </button>
    </nav>

    <div class="p-3 border-t border-default">
      <button
        class="flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        @click="$emit('clear')"
      >
        <Icon name="lucide:trash-2" class="size-4 shrink-0" />
        <span>{{ $t('settings.clearHistory') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
  categories: { id: string; label: string; icon: string }[];
  activeCategory: string;
}>();

const emits = defineEmits<{ (e: 'update:activeCategory', value: string): void; (e: 'clear'): void }>();
</script>
