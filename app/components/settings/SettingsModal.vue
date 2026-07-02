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
                v-if="activeCategory !== 'general'"
                icon="lucide:chevron-left"
                class="p-2"
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
                    <!-- <button
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
                    </button> -->

                    <!-- <button
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
                    </button> -->

                    <button
                      class="md:col-span-2 flex items-center justify-between gap-3 p-4 rounded-2xl border border-default bg-(--ui-background) hover:bg-(--ui-button-selected) transition text-error cursor-pointer"
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

                <section
                  v-else-if="activeCategory === 'profile'"
                  class="space-y-4"
                >
                  <div
                    class="flex items-center gap-4 p-4 rounded-2xl border border-default bg-(--ui-background)/30"
                  >
                    <img
                      v-if="currentUser?.image"
                      :src="currentUser.image"
                      class="w-14 h-14 rounded-full object-cover ring-2 ring-primary shrink-0"
                      alt="Avatar"
                    />
                    <div
                      v-else
                      class="w-14 h-14 rounded-full bg-linear-to-tr from-blue-500 to-violet-600 text-white flex items-center justify-center font-bold text-xl shrink-0"
                    >
                      {{ currentUser?.name?.slice(0, 2).toUpperCase() || 'U' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-semibold text-(--ui-text-primary) truncate"
                      >
                        {{ currentUser?.name }}
                      </p>
                      <p
                        class="text-xs text-(--ui-text-second) mt-0.5 truncate"
                      >
                        {{ currentUser?.email }}
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 md:grid-cols-2">
                    <button
                      class="flex items-center gap-3 p-4 rounded-2xl border border-default bg-(--ui-background) hover:bg-(--ui-button-selected) transition cursor-pointer text-error"
                      @click="handleLogout"
                    >
                      <Icon name="lucide:log-out" class="size-5 shrink-0" />
                      <div class="text-left">
                        <div class="font-semibold text-sm">
                          {{ $t('settings.logout') }}
                        </div>
                        <div class="text-xs text-(--ui-text-second)">
                          {{ $t('settings.logoutSub') }}
                        </div>
                      </div>
                    </button>
                  </div>
                </section>
              </div>
            </Transition>
          </div>

          <!-- <input
            ref="importInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
          /> -->
        </main>
      </div>
    </Transition>
  </dialog>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui';
import { useChatStore } from '~/stores/chat';
import { storeToRefs } from 'pinia';
import { authClient } from '~/lib/auth-client';
import IconButton from '~/components/ui/IconButton.vue';
import SettingsSidebar from './SettingsSidebar.vue';
import SettingItem from './SettingItem.vue';
import { getCurrentInstance } from 'vue';

const props = defineProps<{ isSettingsOpen: boolean }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
// const importInput = ref<HTMLInputElement | null>(null);
const isAnimating = ref(false);
const activeCategory = ref('general');

const toggleSettings = inject('toggleSettings') as (value?: boolean) => void;

const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

const uiStore = useUIStore();
const chatStore = useChatStore();

const currentUser = computed(
  () => authClient.useSession().value?.data?.user ?? null,
);

const { isBlurDisabled, enterToSend, soundEnabled } = storeToRefs(uiStore);

const handleLogout = async () => {
  toggleSettings(false);

  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        navigateTo('/login');
      },
      onError: () => {
        navigateTo('/login');
      },
    },
  });
};

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
  {
    id: 'profile',
    label: localize('settings.categories.profile', 'Profile'),
    icon: 'lucide:user',
    description: localize(
      'settings.categoriesDesc.profileDesc',
      'Manage your profile and account settings.',
    ),
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

// const triggerImport = () => {
//   importInput.value?.click();
// };

// const handleImport = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   if (target.files && target.files[0]) {
//     chatStore.importChats(target.files[0]);
//     target.value = '';
//   }
// };

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
