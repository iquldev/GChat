<template>
  <input
    v-model="modelValue"
    type="text"
    :placeholder="placeholder"
    class="px-4 py-2 rounded-full bg-(--ui-background) text-(--ui-text-primary) md:text-base text-sm outline-none border-none transition-all"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
});

const modelValue = defineModel<string>({ default: "" });
</script>
