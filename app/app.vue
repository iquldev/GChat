<template>
  <div
    class="bg-(--ui-background) min-h-screen"
    :class="{ 'disable-blur': uiStore.isBlurDisabled }"
  >
    <LayoutGroup>
      <motion.div
        layout
        class="h-screen p-6 flex flex-col md:flex-row gap-4 will-change-[filter,transform]"
        :initial="{ filter: 'blur(10px)', opacity: 0 }"
        :animate="{ filter: 'blur(0)', opacity: 1 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
      >
        <Sidebar class="shrink-0" />
        <div class="flex-1 min-w-0 h-full overflow-hidden">
          <NuxtPage />
        </div>
        <SettingsModal :is-settings-open="isSettingsOpen" />
      </motion.div>
    </LayoutGroup>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/sidebar/sidebar.vue";
import SettingsModal from "~/components/settings/settingsModal.vue";
import { useUIStore } from "~/stores/ui";
import { motion, LayoutGroup } from "motion-v";
import { ref, provide } from "vue";

const isSettingsOpen = ref(false);
const uiStore = useUIStore();

const toggleSettings = (value?: boolean) => {
  isSettingsOpen.value = value !== undefined ? value : !isSettingsOpen.value;
};

provide("toggleSettings", toggleSettings);
</script>

<style>
* {
  font-family: "Google Sans", sans-serif;
}

body {
  background-color: var(--ui-background);
  overflow: hidden;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  filter: blur(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
  filter: blur(10px);
}
</style>
