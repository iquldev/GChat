<template>
  <div class="h-screen p-6">
    <Sidebar />
    <SettingsModal v-model="ui.isSettingsOpen" v-if="isMounted" />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/sidebar/sidebar.vue";
import SettingsModal from "~/components/settings/settingsModal.vue";
import { useUIStore } from "~/stores/ui";

const ui = useUIStore();
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<style>
* {
  font-family: "Google Sans", sans-serif;
}
</style>
