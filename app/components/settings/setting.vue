<template>
  <div class="flex items-center justify-between md:gap-12 gap-8">
    <p class="text-(--ui-text-second) md:text-base text-sm">{{ label }}</p>
    <Selector
      v-if="options.length > 0"
      v-model="modelValue"
      :options="options"
    />
    <InputField v-else v-model="modelValue" :placeholder="placeholder || ''" />
  </div>
</template>

<script setup lang="ts">
import InputField from "~/components/inputField.vue";
import Selector from "~/components/selector.vue";

import type { PropType } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
  options: {
    type: Array as PropType<
      { label: string; value: string | number | boolean }[]
    >,
    default: () => [],
  },
});

const modelValue = defineModel<any>();
</script>
