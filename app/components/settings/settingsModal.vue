<template>
  <dialog
    ref="dialogRef"
    class="settings-dialog backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    @close="toggleSettings(false)"
    @click="handleBackdropClick"
  >
    <Transition
      enter-active-class="animate-modal-in"
      leave-active-class="animate-modal-out"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="isAnimating"
        class="settings-content bg-(--ui-block-background) flex flex-col gap-4 p-4 pl-6 rounded-4xl"
      >
        <div class="flex items-center justify-between">
          <h1 class="font-bold md:text-2xl text-xl">
            {{ $t("settings.title") }}
          </h1>
          <SidebarButton
            icon="lucide:arrow-left"
            @click="toggleSettings(false)"
          ></SidebarButton>
        </div>
        <div class="flex flex-col gap-2">
          <Setting
            v-model="currentLocale"
            :label="$t('settings.language')"
            :options="languages"
          />
          <Setting
            v-model="colorMode.preference"
            :label="$t('settings.theme')"
            :options="themes"
          />
          <Setting
            v-model="isBlurDisabled"
            :label="$t('settings.disableBlur')"
            :options="[
              { label: $t('settings.options.off'), value: false },
              { label: $t('settings.options.on'), value: true },
            ]"
          />
        </div>
      </div>
    </Transition>
  </dialog>
</template>

<script setup lang="ts">
import Setting from "./setting.vue";
import { useUIStore } from "~/stores/ui";
import { storeToRefs } from "pinia";

const props = defineProps<{ isSettingsOpen: boolean }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const isAnimating = ref(false);

const toggleSettings = inject("toggleSettings") as (value?: boolean) => void;

const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

const apiKey = useCookie("gemini_api_key", {
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  secure: true,
  sameSite: "strict",
});

const uiStore = useUIStore();
const { isBlurDisabled } = storeToRefs(uiStore);

const languages = [
  { label: "English", value: "en" },
  { label: "Русский", value: "ru" },
];

const themes = computed(() => [
  { label: t("settings.themes.system"), value: "system" },
  { label: t("settings.themes.light"), value: "light" },
  { label: t("settings.themes.dark"), value: "dark" },
]);

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
    }
  },
);

const handleAfterLeave = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
    dialogRef.value.style.display = "none";
  }
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    toggleSettings(false);
  }
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
