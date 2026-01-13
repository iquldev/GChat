<template>
  <input
    v-model="modelValue"
    type="text"
    :placeholder="placeholder"
    class="px-4 py-2 rounded-full bg-(--ui-background) text-(--ui-text-primary) outline-none border-none transition-all"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  isKey: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const modelValue = defineModel<string>({ default: "" });

const handleInput = (e: Event) => {
  if (!props.isKey) return;

  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/[^A-Za-z0-9_-]/g, "");

  if (value.length > 39) {
    value = value.slice(0, 39);
  }

  modelValue.value = value;
  input.value = value;
};
</script>
