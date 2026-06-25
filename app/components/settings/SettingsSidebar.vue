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
        class="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all text-sm font-medium cursor-pointer"
        :class="activeCategory === cat.id
          ? 'bg-(--ui-block-background) border-default text-(--ui-text-primary)'
          : 'text-(--ui-text-second) hover:bg-(--ui-button-selected)'
        "
        @click="$emit('update:activeCategory', cat.id)"
        :aria-current="activeCategory === cat.id ? 'true' : undefined"
      >
        <Icon :name="cat.icon" class="size-4 shrink-0" />
        <span>{{ cat.label }}</span>
      </button>
    </nav>

  </aside>
</template>

<script setup lang="ts">
const _props = defineProps<{
  categories: { id: string; label: string; icon: string }[];
  activeCategory: string;
}>();

const _emits = defineEmits<{ (e: 'update:activeCategory', value: string): void }>();
</script>
