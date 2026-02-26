<template>
  <div
    class="bg-(--ui-background) min-h-screen"
    :class="{ 'disable-blur': uiStore.isBlurDisabled }"
  >
    <LayoutGroup>
      <motion.div
        layout
        class="h-screen p-6 flex flex-col md:flex-row gap-4 will-change-[filter,transform]"
        :initial="{
          filter: uiStore.isBlurDisabled ? 'blur(0px)' : 'blur(10px)',
          opacity: 0,
        }"
        :animate="{ filter: 'blur(0px)', opacity: 1 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
      >
        <Sidebar class="shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            :key="$route.path"
            class="flex-1 min-w-0 h-full overflow-hidden will-change-[transform,opacity]"
            :initial="{
              opacity: 0,
              y: 10,
              scale: 0.98,
              filter: uiStore.isBlurDisabled ? 'blur(0px)' : 'blur(10px)',
            }"
            :animate="{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }"
            :exit="{
              opacity: 0,
              y: -10,
              scale: 0.98,
              filter: uiStore.isBlurDisabled ? 'blur(0px)' : 'blur(10px)',
            }"
            :transition="{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }"
          >
            <NuxtPage />
          </motion.div>
        </AnimatePresence>
        <SettingsModal :is-settings-open="isSettingsOpen" />
      </motion.div>
    </LayoutGroup>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { motion, LayoutGroup, AnimatePresence } from "motion-v";

const isSettingsOpen = ref(false);
const uiStore = useUIStore();

const toggleSettings = (value?: boolean) => {
  isSettingsOpen.value = value !== undefined ? value : !isSettingsOpen.value;
};

provide("toggleSettings", toggleSettings);
</script>
