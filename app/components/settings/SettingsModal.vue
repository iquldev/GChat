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
                class="bg-(--ui-block-background) flex md:flex-row flex-col w-[min(900px,95vw)] md:h-150 h-[80vh] rounded-4xl border border-default overflow-hidden shadow-2xl"
            >
                <!-- Sidebar -->
                <SettingsSidebar
                  v-model:active-category="activeCategory"
                  :categories="categories"
                  @clear="confirmClearAll"
                />

                <!-- Main Content -->
                <main
                    class="flex-1 flex flex-col min-w-0 bg-(--ui-block-background)"
                >
                    <div
                        class="flex items-center justify-between p-6 border-b border-default"
                    >
                        <h2 class="text-lg font-bold">
                            {{
                                categories.find((c) => c.id === activeCategory)
                                    ?.label
                            }}
                        </h2>
                        <IconButton
                            icon="lucide:x"
                            class="p-2!"
                            @click="toggleSettings(false)"
                        />
                    </div>

                    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <Transition
                            mode="out-in"
                            enter-active-class="animate-fade-in"
                            leave-active-class="animate-fade-out"
                        >
                            <div
                                :key="activeCategory"
                                class="flex flex-col gap-4"
                            >
                                <!-- AI Category -->
                                <template v-if="activeCategory === 'ai'">
                                    <SettingItem
                                        v-model="aiTemperature"
                                        :label="$t('settings.temperature')"
                                        type="number"
                                    />
                                    <SettingItem
                                        v-model="aiMaxTokens"
                                        :label="$t('settings.maxTokens')"
                                        type="number"
                                    />
                                    <SettingItem
                                        v-model="customModelId"
                                        :label="$t('settings.customModelId')"
                                        type="text"
                                        :placeholder="
                                            $t(
                                                'settings.placeholders.customModelId',
                                            )
                                        "
                                    />
                                    <SettingItem
                                        v-model="userApiKey"
                                        :label="$t('settings.apiKey')"
                                        type="text"
                                        :placeholder="
                                            $t('settings.placeholders.apiKey')
                                        "
                                    />
                                    <SettingItem
                                        v-model="customSystemPrompt"
                                        :label="$t('settings.systemPrompt')"
                                        type="textarea"
                                        :placeholder="
                                            $t(
                                                'settings.placeholders.systemPrompt',
                                            )
                                        "
                                    />
                                </template>

                                <!-- Interface Category -->
                                <template
                                    v-else-if="activeCategory === 'interface'"
                                >
                                    <SettingItem
                                        v-model="currentLocale"
                                        :label="localize('settings.language','Language')"
                                        type="select"
                                        :options="languages"
                                    />
                                    <SettingItem
                                        v-model="colorMode.preference"
                                        :label="localize('settings.theme','Theme')"
                                        type="select"
                                        :options="themes"
                                    />
                                    <SettingItem
                                        v-model="isBlurDisabled"
                                        :label="localize('settings.disableBlur','Disable Blur')"
                                        type="toggle"
                                    />
                                    <SettingItem
                                        v-model="isOledMode"
                                        :label="$t('settings.oledMode')"
                                        type="toggle"
                                    />
                                    <SettingItem
                                        v-model="enterToSend"
                                        :label="$t('settings.enterToSend')"
                                        type="toggle"
                                    />
                                    <SettingItem
                                        v-model="soundEnabled"
                                        :label="$t('settings.soundEnabled')"
                                        type="toggle"
                                    />
                                </template>

                                <!-- Data Category -->
                                <template v-else-if="activeCategory === 'data'">
                                    <div
                                        class="p-4 rounded-3xl border border-default bg-(--ui-background)/30"
                                    >
                                        <p
                                            class="text-sm text-(--ui-text-second)"
                                        >
                                            {{ $t("settings.dataDescription") }}
                                        </p>
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <button
                                            class="flex items-center justify-between p-4 rounded-3xl border border-default bg-(--ui-background)/30 hover:bg-(--ui-button-selected) transition-all cursor-pointer group"
                                            @click="chatStore.exportChats()"
                                        >
                                            <div
                                                class="flex items-center gap-4"
                                            >
                                                <div
                                                    class="size-10 flex items-center justify-center rounded-full bg-(--ui-background) border border-default group-hover:scale-110 transition-transform"
                                                >
                                                    <Icon
                                                        name="lucide:download"
                                                        class="size-5"
                                                    />
                                                </div>
                                                <div class="text-left">
                                                    <div
                                                        class="font-bold text-sm"
                                                    >
                                                        {{
                                                            $t(
                                                                "settings.exportHistory",
                                                            )
                                                        }}
                                                    </div>
                                                    <div
                                                        class="text-xs text-(--ui-text-second)"
                                                    >
                                                        {{
                                                            $t(
                                                                "settings.exportSub",
                                                            )
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                            <Icon
                                                name="lucide:chevron-right"
                                                class="size-5 text-(--ui-text-second)"
                                            />
                                        </button>

                                        <button
                                            class="flex items-center justify-between p-4 rounded-3xl border border-default bg-(--ui-background)/30 hover:bg-(--ui-button-selected) transition-all cursor-pointer group"
                                            @click="triggerImport"
                                        >
                                            <div
                                                class="flex items-center gap-4"
                                            >
                                                <div
                                                    class="size-10 flex items-center justify-center rounded-full bg-(--ui-background) border border-default group-hover:scale-110 transition-transform"
                                                >
                                                    <Icon
                                                        name="lucide:upload"
                                                        class="size-5"
                                                    />
                                                </div>
                                                <div class="text-left">
                                                    <div
                                                        class="font-bold text-sm"
                                                    >
                                                        {{
                                                            $t(
                                                                "settings.importHistory",
                                                            )
                                                        }}
                                                    </div>
                                                    <div
                                                        class="text-xs text-(--ui-text-second)"
                                                    >
                                                        {{
                                                            $t(
                                                                "settings.importSub",
                                                            )
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                            <Icon
                                                name="lucide:chevron-right"
                                                class="size-5 text-(--ui-text-second)"
                                            />
                                        </button>
                                    </div>
                                </template>
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
import { useUIStore } from "~/stores/ui";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";
import IconButton from "~/components/ui/IconButton.vue";
import SettingsSidebar from './SettingsSidebar.vue';
import SettingItem from './SettingItem.vue';

const props = defineProps<{ isSettingsOpen: boolean }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const importInput = ref<HTMLInputElement | null>(null);
const isAnimating = ref(false);
// Default to 'interface' so tests that expect language/theme toggles find them on open
const activeCategory = ref("interface");

const toggleSettings = inject("toggleSettings") as (value?: boolean) => void;

const colorMode = useColorMode();
const { locale, setLocale, t } = useI18n();

const uiStore = useUIStore();
const chatStore = useChatStore();
const {
    isBlurDisabled,
    aiTemperature,
    aiMaxTokens,
    customSystemPrompt,
    customModelId,
    enterToSend,
    userApiKey,
    soundEnabled,
    isOledMode,
} = storeToRefs(uiStore);

const categories = computed(() => [
    { id: "ai", label: localize("settings.categories.ai","AI"), icon: "lucide:bot" },
    {
        id: "interface",
        label: localize("settings.categories.interface","Interface"),
        icon: "lucide:layout",
    },
    {
        id: "data",
        label: localize("settings.categories.data","Data"),
        icon: "lucide:database",
    },
]);

const languages = [
    { label: "English", value: "en" },
    { label: "Русский", value: "ru" },
];

const themes = computed(() => [
    { label: localize("settings.themes.system","System"), value: "system" },
    { label: localize("settings.themes.light","Light"), value: "light" },
    { label: localize("settings.themes.dark","Dark"), value: "dark" },
]);

import { getCurrentInstance } from 'vue';

const localize = (key: string, fallback: string) => {
    const res = t(key as any);
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
        target.value = "";
    }
};

const confirmClearAll = () => {
    if (confirm(t("settings.confirmClear"))) {
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
