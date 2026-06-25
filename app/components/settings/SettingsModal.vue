<template>
  <dialog
    ref="dialogRef"
    class="settings-dialog p-0 border-none outline-none bg-transparent fixed inset-0 m-auto"
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
        class="bg-(--ui-block-background) flex md:flex-row flex-col w-[min(980px,96vw)] md:h-150 h-[86vh] rounded-3xl border border-default overflow-hidden shadow-2xl"
      >
        <!-- Sidebar -->
        <SettingsSidebar
          v-model:active-category="activeCategory"
          :categories="categories"
        />

        <!-- Main Content -->
        <main class="flex-1 flex flex-col min-w-0 bg-(--ui-background)">
          <!-- Header -->
          <div
            class="flex items-start justify-between p-5 border-b border-default"
          >
            <div class="flex flex-col">
              <h2 class="text-2xl font-semibold text-(--ui-text-primary)">
                {{ categories.find((c) => c.id === activeCategory)?.label }}
              </h2>
              <p class="mt-1 text-sm text-(--ui-text-second)">
                {{
                  categories.find((c) => c.id === activeCategory)
                    ?.description || $t('settings.subtitle')
                }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <IconButton
                icon="lucide:chevron-left"
                class="p-2"
                v-if="activeCategory !== 'general'"
                @click="activeCategory = 'general'"
              />
              <IconButton
                icon="lucide:x"
                class="p-2"
                @click="toggleSettings(false)"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <Transition
              mode="out-in"
              enter-active-class="animate-fade-in"
              leave-active-class="animate-fade-out"
            >
              <div :key="activeCategory">
                <!-- General / Appearance -->
                <section
                  v-if="activeCategory === 'general'"
                  class="grid gap-6 md:grid-cols-2"
                >
                  <SettingItem
                    v-model="currentLocale"
                    :label="localize('settings.language', 'Language')"
                    type="select"
                    :options="languages"
                  />

                  <SettingItem
                    v-model="colorMode.preference"
                    :label="localize('settings.theme', 'Theme')"
                    type="select"
                    :options="themes"
                    :description="$t('settings.themeDesc')"
                  />

                  <SettingItem
                    v-model="isBlurDisabled"
                    :label="$t('settings.disableBlur')"
                    type="toggle"
                    :description="$t('settings.disableBlurDesc')"
                  />

                  <SettingItem
                    v-model="enterToSend"
                    :label="$t('settings.enterToSend')"
                    type="toggle"
                    :description="$t('settings.enterToSendDesc')"
                  />

                  <SettingItem
                    v-model="soundEnabled"
                    :label="$t('settings.soundEnabled')"
                    type="toggle"
                    :description="$t('settings.soundEnabledDesc')"
                  />
                </section>

                <!-- Data / Privacy -->
                <section
                  v-else-if="activeCategory === 'data'"
                  class="space-y-4"
                >
                  <div
                    class="p-4 rounded-2xl border border-default bg-(--ui-block-background)"
                  >
                    <h3 class="text-sm font-semibold text-(--ui-text-primary)">
                      {{ $t('settings.dataTitle') }}
                    </h3>
                    <p class="mt-1 text-xs text-(--ui-text-second)">
                      {{ $t('settings.dataDescription') }}
                    </p>
                  </div>

                  <div class="grid gap-4 md:grid-cols-2">
                    <button
                      class="flex items-center gap-3 p-4 rounded-2xl border border-default bg-(--ui-background) hover:bg-(--ui-button-selected) transition cursor-pointer"
                      @click="chatStore.exportChats()"
                    >
                      <Icon name="lucide:download" class="size-5" />
                      <div class="text-left">
                        <div class="font-semibold text-sm">
                          {{ $t('settings.exportHistory') }}
                        </div>
                        <div class="text-xs text-(--ui-text-second)">
                          {{ $t('settings.exportSub') }}
                        </div>
                      </div>
                    </button>

                    <button
                      class="flex items-center gap-3 p-4 rounded-2xl border border-default bg-(--ui-background) hover:bg-(--ui-button-selected) transition cursor-pointer"
                      @click="triggerImport"
                    >
                      <Icon name="lucide:upload" class="size-5" />
                      <div class="text-left">
                        <div class="font-semibold text-sm">
                          {{ $t('settings.importHistory') }}
                        </div>
                        <div class="text-xs text-(--ui-text-second)">
                          {{ $t('settings.importSub') }}
                        </div>
                      </div>
                    </button>

                    <button
                      class="md:col-span-2 flex items-center justify-between gap-3 p-4 rounded-2xl border border-default bg-(--ui-background) hover:bg-(--ui-button-selected) transition text-(--ui-error) cursor-pointer"
                      @click="confirmClearAll"
                    >
                      <div class="flex items-center gap-3">
                        <Icon name="lucide:trash-2" class="size-5" />
                        <div class="text-left">
                          <div class="font-semibold text-sm">
                            {{ $t('settings.clearHistory') }}
                          </div>
                          <div class="text-xs text-(--ui-text-second)">
                            {{ $t('settings.clearSub') }}
                          </div>
                        </div>
                      </div>
                      <Icon name="lucide:trash" class="size-5" />
                    </button>
                  </div>
                </section>
              </div>
            </Transition>
          </div>

          <input
            ref="importInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
          />
        </main>
      </div>
    </Transition>
  </dialog>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui';
import { useChatStore } from '~/stores/chat';
import { storeToRefs } from 'pinia';
import IconButton from '~/components/ui/IconButton.vue';
import SettingsSidebar from './SettingsSidebar.vue';
import SettingItem from './SettingItem.vue';
import { getCurrentInstance } from 'vue';

const props = defineProps<{ isSettingsOpen: boolean }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const importInput = ref<HTMLInputElement | null>(null);
const isAnimating = ref(false);
const activeCategory = ref('general');

const toggleSettings = inject('toggleSettings') as (value?: boolean) => void;

const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

const uiStore = useUIStore();
const chatStore = useChatStore();
const { isBlurDisabled, enterToSend, soundEnabled } = storeToRefs(uiStore);

const categories = computed(() => [
  {
    id: 'general',
    label: localize('settings.categories.general', 'Appearance'),
    icon: 'lucide:layout',
    description: t('settings.categoriesDesc.generalDesc'),
  },
  {
    id: 'data',
    label: localize('settings.categories.data', 'Data & Privacy'),
    icon: 'lucide:database',
    description: t('settings.categoriesDesc.dataDesc'),
  },
]);

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Русский', value: 'ru' },
];

const themes = computed(() => [
  { label: localize('settings.themes.system', 'System'), value: 'system' },
  { label: localize('settings.themes.light', 'Light'), value: 'light' },
  { label: localize('settings.themes.dark', 'Dark'), value: 'dark' },
]);

const localize = (key: string, fallback: string) => {
  const res = t(key);
  if (typeof res === 'string' && !res.includes('settings.')) return res;
  const inst = getCurrentInstance();
  const globalT = inst?.appContext.config.globalProperties.$t as unknown as (
    k: string,
  ) => string;
  if (globalT) {
    const g = globalT(key);
    if (typeof g === 'string' && !g.includes('settings.')) return g;
  }
  return fallback;
};

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
      dialogRef.value.showModal();
    } else {
      isAnimating.value = false;
    }
  },
);

const handleAfterLeave = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
  }
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    toggleSettings(false);
  }
};

const triggerImport = () => {
  importInput.value?.click();
};

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    chatStore.importChats(target.files[0]);
    target.value = '';
  }
};

const confirmClearAll = () => {
  if (confirm(t('settings.confirmClear'))) {
    chatStore.clearAllChats();
    toggleSettings(false);
  }
};
</script>

<style scoped>
.settings-dialog::backdrop {
  background: var(--ui-backdrop-bg);
  backdrop-filter: var(--ui-backdrop-blur);
}
</style>
