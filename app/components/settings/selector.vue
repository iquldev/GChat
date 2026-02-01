<template>
  <div class="relative flex items-center w-fit" ref="target">
    <div
      @click="isOpen = !isOpen"
      class="flex items-center pl-4 pr-10 py-2 rounded-full bg-(--ui-background) cursor-pointer text-(--ui-text-primary) md:text-base text-sm hover:opacity-80 transition-all select-none"
    >
      {{ currentLabel }}
      <Icon
        name="lucide:chevron-down"
        class="text-(--ui-text-second) absolute right-3 w-5 h-5 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <client-only>
      <motion.div
        v-if="isOpen"
        initial="{ opacity: 0, y: -10, scale: 0.95 }"
        animate="{ opacity: 1, y: 0, scale: 1 }"
        exit="{ opacity: 0, y: -10, scale: 0.95 }"
        class="absolute top-full left-0 mt-2 min-w-full w-max bg-(--ui-background) border border-white/5 rounded-3xl shadow-xl z-50 overflow-hidden backdrop-blur-md"
      >
        <div class="p-1 flex flex-col gap-1">
          <div
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option.value)"
            class="px-4 py-2 rounded-full cursor-pointer text-(--ui-text-primary) md:text-base text-sm transition-colors hover:bg-white/5 whitespace-nowrap"
            :class="{ 'bg-white/10': modelValue === option.value }"
          >
            {{ option.label }}
          </div>
        </div>
      </motion.div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { motion } from "motion-v";
import type { PropType } from "vue";

const props = defineProps({
  options: {
    type: Array as PropType<{ label: string; value: string | number }[]>,
    required: true,
  },
});

const modelValue = defineModel<string | number>();
const isOpen = ref(false);
const target = ref(null);

onClickOutside(target, () => {
  isOpen.value = false;
});

const currentLabel = computed(() => {
  return (
    props.options.find((opt) => opt.value === modelValue.value)?.label ||
    "Select..."
  );
});

const selectOption = (value: string | number) => {
  modelValue.value = value;
  isOpen.value = false;
};
</script>
