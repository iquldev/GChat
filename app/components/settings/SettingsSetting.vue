<template>
  <div class="flex items-center justify-between md:gap-12 gap-8">
    <p class="text-(--ui-text-second) md:text-base text-sm">{{ label }}</p>
    <UiSelector
      v-if="options && options.length > 0"
      v-model="modelValue"
      :options="options"
    />
    <InputField v-else v-model="stringValue" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts" generic="T extends string | boolean | number">
withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    options?: { label: string; value: T }[];
  }>(),
  {
    placeholder: "",
    options: () => [],
  },
);

const modelValue = defineModel<T>();

const stringValue = computed({
  get: () => String(modelValue.value ?? ""),
  set: (val: string) => {
    const currentType = typeof modelValue.value;
    if (currentType === "number") {
      modelValue.value = Number(val) as T;
    } else if (currentType === "boolean") {
      modelValue.value = (val === "true") as T;
    } else {
      modelValue.value = val as T;
    }
  },
});
</script>
