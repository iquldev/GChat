<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="item in examples"
        :key="item.key"
        type="button"
        class="pl-4 pr-4 py-2 rounded-full bg-(--ui-background) text-(--ui-text-primary) md:text-base text-sm border border-default flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer"
        @click="$emit('update:prompt', $t(item.promptKey))"
        :title="$t(item.titleKey)"
        :aria-label="$t(item.ariaKey)"
      >
        <Icon :name="item.icon" class="w-4 h-4 text-(--ui-text-second)" />
        <span>{{ $t(item.labelKey) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const _emit = defineEmits(['update:prompt']);

const examples = [
  {
    key: 'python',
    icon: 'lucide:code',
    labelKey: 'chat.examples.python.label',
    promptKey: 'chat.examples.python.prompt',
    titleKey: 'chat.examples.python.title',
    ariaKey: 'chat.examples.python.aria',
  },
  {
    key: 'tz',
    icon: 'lucide:file-text',
    labelKey: 'chat.examples.tz.label',
    promptKey: 'chat.examples.tz.prompt',
    titleKey: 'chat.examples.tz.title',
    ariaKey: 'chat.examples.tz.aria',
  },
  {
    key: 'cicd',
    icon: 'lucide:git-branch',
    labelKey: 'chat.examples.cicd.label',
    promptKey: 'chat.examples.cicd.prompt',
    titleKey: 'chat.examples.cicd.title',
    ariaKey: 'chat.examples.cicd.aria',
  },
  {
    key: 'ml',
    icon: 'lucide:book-open',
    labelKey: 'chat.examples.ml.label',
    promptKey: 'chat.examples.ml.prompt',
    titleKey: 'chat.examples.ml.title',
    ariaKey: 'chat.examples.ml.aria',
  },
];
</script>
