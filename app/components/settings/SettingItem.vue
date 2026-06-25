<template>
  <div
    class="flex flex-col gap-3 p-4 rounded-2xl border border-default bg-(--ui-background)/30"
    :class="{ 'flex-row items-center justify-between': type !== 'textarea' }"
  >
    <div class="flex flex-col gap-0.5">
      <p class="text-sm font-semibold text-(--ui-text-primary)">
        {{ label }}
      </p>
      <p v-if="description" class="text-xs text-(--ui-text-second)">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <!-- Select -->
      <ModelSelector
        v-if="type === 'select' && options"
        v-model="modelValue"
        :options="options"
        direction="down"
      />

      <!-- Toggle -->
      <button
        v-else-if="type === 'toggle'"
        class="relative inline-flex items-center h-7 w-12 rounded-full transition-all cursor-pointer border border-default outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-(--ui-background)"
        :class="
          modelValue ? 'bg-(--ui-text-primary)' : 'bg-(--ui-button-selected)'
        "
        type="button"
        role="switch"
        :aria-checked="!!modelValue"
        :aria-pressed="!!modelValue"
        @click="modelValue = !modelValue"
      >
        <span
          class="inline-block size-5 transform rounded-full transition-transform duration-200 shadow-sm"
          :class="[
            modelValue ?
              'translate-x-6 bg-(--ui-background)'
            : 'translate-x-1 bg-(--ui-text-second)',
          ]"
        />
      </button>

      <!-- Number -->
      <input
        v-else-if="type === 'number'"
        v-model.number="modelValue"
        type="number"
        class="w-24 px-4 py-1.5 rounded-xl border border-default bg-(--ui-background) text-sm text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      />

      <!-- Text -->
      <input
        v-else-if="type === 'text'"
        v-model="modelValue"
        type="text"
        :placeholder="placeholder"
        class="md:w-96 w-full px-4 py-1.5 rounded-xl border border-default bg-(--ui-background) text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      />

      <slot name="action" />
    </div>

    <!-- Textarea -->
    <textarea
      v-if="type === 'textarea'"
      v-model="modelValue as string"
      :placeholder="placeholder"
      rows="4"
      class="w-full px-4 py-3 rounded-xl border border-default bg-(--ui-background) text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none font-sans"
    />
  </div>
</template>

<script setup lang="ts">
import ModelSelector from '~/components/compose/ModelSelector.vue';

interface SettingProps {
  label: string;
  description?: string;
  placeholder?: string;
  type?: 'select' | 'text' | 'number' | 'textarea' | 'toggle';
  options?: { label: string; value: string | number | boolean }[];
}

defineProps<SettingProps>();

const modelValue = defineModel<string | number | boolean>();
</script>
