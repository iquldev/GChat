<script setup lang="ts">
import Sidebar from "~/components/sidebar/sidebar.vue";
import SettingsModal from "~/components/settings/settingsModal.vue";
import ChatBlock from "~/components/homepage/chatBlock.vue";
import { motion } from "motion-v";

const isSettingsOpen = ref(false);

const toggleSettings = (value?: boolean) => {
  isSettingsOpen.value = value !== undefined ? value : !isSettingsOpen.value;
};

provide("toggleSettings", toggleSettings);
</script>

<template>
  <div class="h-screen p-6 flex flex-col md:flex-row gap-4">
    <Sidebar class="shrink-0" />
    <ChatBlock class="flex-1 min-w-0" />
    <SettingsModal :is-settings-open="isSettingsOpen" />
  </div>
</template>

<style>
* {
  font-family: "Google Sans", sans-serif;
}
</style>
