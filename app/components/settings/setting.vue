<template>
  <div class="flex items-center justify-between gap-12">
    <p class="text-(--ui-text-second)">{{ label }}</p>
    <Selector
      v-if="options.length > 0"
      v-model="modelValue"
      :options="options"
    />
    <inputField
      v-else
      v-model="modelValue"
      :placeholder="placeholder || ''"
      :is-key="isKey"
    />
  </div>
</template>

<script setup lang="ts">
import inputField from "./inputField.vue";
import Selector from "./selector.vue";

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
    type: Array as PropType<{ label: string; value: string | number }[]>,
    default: () => [],
  },
  isKey: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel<any>();
</script>
