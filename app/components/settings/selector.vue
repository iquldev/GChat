<template>
  <div class="relative flex items-center w-fit">
    <select
      v-model="modelValue"
      class="appearance-none pl-4 pr-10 py-2 rounded-full bg-(--ui-background) outline-none border-none cursor-pointer text-(--ui-text-primary) md:text-base text-sm hover:opacity-50 transition-all"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="bg-(--ui-background) text-(--ui-text-primary)"
      >
        {{ option.label }}
      </option>
    </select>
    <Icon
      name="lucide:chevron-down"
      class="absolute right-3 w-5 h-5 pointer-events-none text-(--ui-text-primary)"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  options: {
    type: Array as PropType<{ label: string; value: string | number }[]>,
    required: true,
  },
});

const modelValue = defineModel<string | number>();
</script>
