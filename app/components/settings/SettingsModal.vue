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
                <aside
                    class="md:w-64 w-full flex flex-col border-r border-default bg-(--ui-background)/50"
                >
                    <div
                        class="flex items-center gap-3 p-6 border-b border-default"
                    >
                        <Icon
                            name="lucide:settings"
                            class="size-6 text-(--ui-text-primary)"
                        />
                        <h1 class="font-bold text-xl">
                            {{ $t("settings.title") }}
                        </h1>
                    </div>

                    <nav
                        class="flex-1 p-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar"
                    >
                        <button
                            v-for="cat in categories"
                            :key="cat.id"
                            class="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all text-sm font-medium cursor-pointer border"
                            :class="
                                activeCategory === cat.id
                                    ? 'bg-(--ui-background) border-default text-(--ui-text-primary)'
                                    : 'border-transparent text-(--ui-text-second) hover:bg-(--ui-button-selected)'
                            "
                            @click="activeCategory = cat.id"
                        >
                            <Icon :name="cat.icon" class="size-4 shrink-0" />
                            <span>{{ cat.label }}</span>
                        </button>
                    </nav>

                    <div class="p-3 border-t border-default">
                        <button
                            class="flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                            @click="confirmClearAll"
                        >
                            <Icon
                                name="lucide:trash-2"
                                class="size-4 shrink-0"
                            />
                            <span>{{ $t("settings.clearHistory") }}</span>
                        </button>
                    </div>
                </aside>

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
                                    <SettingsSetting
                                        v-model="aiTemperature"
                                        :label="$t('settings.temperature')"
                                        type="number"
                                    />
                                    <SettingsSetting
                                        v-model="aiMaxTokens"
                                        :label="$t('settings.maxTokens')"
                                        type="number"
                                    />
                                    <SettingsSetting
                                        v-model="customModelId"
                                        :label="$t('settings.customModelId')"
                                        type="text"
                                        :placeholder="
                                            $t(
                                                'settings.placeholders.customModelId',
                                            )
                                        "
                                    />
                                    <SettingsSetting
                                        v-model="userApiKey"
                                        :label="$t('settings.apiKey')"
                                        type="text"
                                        :placeholder="
                                            $t('settings.placeholders.apiKey')
                                        "
                                    />
                                    <SettingsSetting
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
                                    <SettingsSetting
                                        v-model="currentLocale"
                                        :label="$t('settings.language')"
                                        type="select"
                                        :options="languages"
                                    />
                                    <SettingsSetting
                                        v-model="colorMode.preference"
                                        :label="$t('settings.theme')"
                                        type="select"
                                        :options="themes"
                                    />
                                    <SettingsSetting
                                        v-model="isBlurDisabled"
                                        :label="$t('settings.disableBlur')"
                                        type="toggle"
                                    />
                                    <SettingsSetting
                                        v-model="isOledMode"
                                        :label="$t('settings.oledMode')"
                                        type="toggle"
                                    />
                                    <SettingsSetting
                                        v-model="enterToSend"
                                        :label="$t('settings.enterToSend')"
                                        type="toggle"
                                    />
                                    <SettingsSetting
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
import SettingsSetting from './SettingsSetting.vue';

const props = defineProps<{ isSettingsOpen: boolean }>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const importInput = ref<HTMLInputElement | null>(null);
const isAnimating = ref(false);
const activeCategory = ref("ai");

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
    { id: "ai", label: t("settings.categories.ai"), icon: "lucide:bot" },
    {
        id: "interface",
        label: t("settings.categories.interface"),
        icon: "lucide:layout",
    },
    {
        id: "data",
        label: t("settings.categories.data"),
        icon: "lucide:database",
    },
]);

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
