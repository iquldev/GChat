<template>
  <div ref="target" class="relative flex items-center w-fit">
    <div
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      aria-controls="selector-listbox"
      aria-label="Select option"
      tabindex="0"
      class="flex items-center pl-4 pr-10 py-2 rounded-full bg-(--ui-background) cursor-pointer text-(--ui-text-primary) md:text-base text-sm hover:opacity-80 transition-all select-none"
      @click="isOpen = !isOpen"
      @keydown.enter.prevent="isOpen = !isOpen"
      @keydown.space.prevent="isOpen = !isOpen"
      @keydown.escape="isOpen = false"
      @keydown.down.prevent="isOpen = true"
      @keydown.up.prevent="isOpen = true"
    >
      {{ currentLabel }}
      <Icon
        name="lucide:chevron-down"
        class="text-(--ui-text-second) absolute right-3 w-5 h-5 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>
    <client-only>
      <Transition
        :enter-active-class="
          direction === 'up' ? 'animate-dropdown-up-in' : 'animate-dropdown-in'
        "
        :leave-active-class="
          direction === 'up'
            ? 'animate-dropdown-up-out'
            : 'animate-dropdown-out'
        "
      >
        <div
          v-if="isOpen"
          id="selector-listbox"
          role="listbox"
          class="absolute left-0 min-w-full w-max bg-(--ui-background) border border-white/5 rounded-3xl shadow-xl z-50 overflow-hidden backdrop-blur-md"
          :class="direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'"
        >
          <div class="p-1 flex flex-col gap-1">
            <div
              v-for="option in options"
              :key="String(option.value)"
              class="px-4 py-2 rounded-full cursor-pointer text-(--ui-text-primary) md:text-base text-sm transition-colors whitespace-nowrap hover:bg-(--ui-button-selected)"
              :class="{
                'bg-white/5':
                  modelValue === option.value && colorMode.value === 'dark',
                'bg-black/10':
                  modelValue === option.value && colorMode.value === 'light',
              }"
              @click="selectOption(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </Transition>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  options: {
    type: Array as PropType<
      { label: string; value: string | number | boolean }[]
    >,
    required: true,
  },
  direction: {
    type: String as PropType<"up" | "down">,
    default: "down",
  },
});

const modelValue = defineModel<string | number | boolean>();
const isOpen = ref(false);
const target = ref<HTMLElement | null>(null);
const { t } = useI18n();

const colorMode = useColorMode();

onClickOutside(target, () => {
  isOpen.value = false;
});

const currentLabel = computed(() => {
  return (
    props.options.find((opt) => opt.value === modelValue.value)?.label ||
    t("common.select")
  );
});

const selectOption = (value: string | number | boolean) => {
  modelValue.value = value;
  isOpen.value = false;
};
</script>
