<template>
  <dialog
    ref="dialogRef"
    class="settings-dialog backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    @close="handleClose"
    @click="handleBackdropClick"
  >
    <motion.div
      v-if="isAnimating"
      class="settings-content bg-(--ui-sidebar-background) flex flex-col gap-4 p-4 pl-6 rounded-4xl"
      :initial="{ opacity: 0, scale: 0.95, y: -20 }"
      :animate="{ opacity: 1, scale: 1, y: 0 }"
    >
      <div class="flex items-center justify-between">
        <h1 class="font-bold text-2xl">Settings</h1>
        <SidebarButton
          icon="lucide:arrow-left"
          @click="closeDialog"
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
    </motion.div>
  </dialog>
</template>

<script setup lang="ts">
import Setting from "./setting.vue";
import { motion } from "motion-v";

const props = defineProps<{ isSettingsOpen: boolean }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const isAnimating = ref(false);

const toggleSettings = inject("toggleSettings") as (value?: boolean) => void;

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

watch(
  () => props.isSettingsOpen,
  (isOpen) => {
    if (!dialogRef.value) return;

    if (isOpen) {
      isAnimating.value = true;
      dialogRef.value.style.display = "flex";
      dialogRef.value.showModal();
    } else {
      isAnimating.value = false;
      dialogRef.value.close();
      dialogRef.value.style.display = "none";
    }
  }
);

const handleClose = () => {
  toggleSettings(false);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    closeDialog();
  }
};

const closeDialog = () => {
  dialogRef.value?.close();
};
</script>

<style scoped>
.settings-dialog {
  border: none;
  outline: none;
  background: transparent;
  max-width: 90vw;
  max-height: 90vh;
  position: fixed;
  inset: 0;
  margin: auto;
  display: none;
  padding: 0;
  overflow: visible;
}

.settings-dialog[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}
</style>
