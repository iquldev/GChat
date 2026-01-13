<template>
  <div
    class="fixed inset-0 flex items-center justify-center h-screen w-screen bg-black/80 backdrop-blur-sm"
  >
    <div
      class="bg-(--ui-sidebar-background) flex flex-col gap-4 p-4 pl-6 rounded-4xl"
    >
      <div class="flex items-center justify-between">
        <h1 class="font-bold text-2xl">Settings</h1>
        <SidebarButton
          icon="lucide:arrow-left"
          @click="ui.toggleSettings(false)"
        ></SidebarButton>
      </div>
      <div class="flex flex-col gap-2">
        <Setting
          v-model="apiKey"
          label="Gemini API Key"
          placeholder="AIzaSyC..."
          isKey
        />
        <Setting
          v-model="currentLocale"
          label="Language"
          :options="languages"
        />
        <Setting
          v-model="colorMode.preference"
          label="Theme"
          :options="themes"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Setting from "./setting.vue";
import { useUIStore } from "~/stores/ui";

const ui = useUIStore();
const colorMode = useColorMode();
const { locale, setLocale } = useI18n();

const apiKey = useCookie("gemini_api_key", {
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
});

const languages = [
  { label: "English", value: "en" },
  { label: "Русский", value: "ru" },
];

const themes = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value);
  },
});
</script>
