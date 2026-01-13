<script setup lang="ts">
import Sidebar from "~/components/sidebar/sidebar.vue";
import SettingsModal from "~/components/settings/settingsModal.vue";

const isSettingsOpen = ref(false);

const toggleSettings = (value?: boolean) => {
  isSettingsOpen.value = value !== undefined ? value : !isSettingsOpen.value;
};

provide("toggleSettings", toggleSettings);
</script>

<template>
  <div class="h-screen p-6">
    <Sidebar />
    <SettingsModal :is-settings-open="isSettingsOpen" />
  </div>
</template>

<style>
* {
  font-family: "Google Sans", sans-serif;
}
</style>
