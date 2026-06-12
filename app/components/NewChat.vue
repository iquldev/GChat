<template>
    <motion.div
        class="bg-(--ui-block-background) px-6 py-5 rounded-4xl flex flex-col gap-4 md:w-180 w-full border border-default shadow-lg"
        :class="{ 'md:w-full': chatId }"
        layout
    >
        <div v-if="attachments.length > 0" class="flex flex-wrap gap-2">
            <div
                v-for="(att, index) in attachments"
                :key="index"
                class="relative group w-16 h-16 rounded-xl overflow-hidden border border-default shrink-0"
            >
                <img
                    v-if="att.mimeType.startsWith('image/')"
                    :src="att.previewUrl"
                    class="w-full h-full object-cover"
                />
                <div
                    v-else
                    class="w-full h-full flex flex-col items-center justify-center bg-(--ui-background) text-xs truncate p-1"
                    :title="att.name"
                >
                    <Icon
                        name="lucide:file"
                        class="w-6 h-6 mb-1 text-(--ui-text-second)"
                    />
                    <span
                        class="w-full text-center truncate px-1 text-[10px] font-bold"
                        >{{
                            att.name.split(".").pop()?.toUpperCase() || "FILE"
                        }}</span
                    >
                </div>
                <button
                    type="button"
                    class="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    @click="removeAttachment(index)"
                >
                    <Icon name="lucide:x" class="w-3 h-3" />
                </button>
            </div>
        </div>
        <textarea
            ref="textarea"
            v-model="prompt"
            rows="1"
            :placeholder="$t('chat.promptPlaceholder')"
            :aria-label="$t('chat.promptLabel')"
            class="text-(--ui-text-primary) md:text-lg text-base outline-none border-none transition-all resize-none bg-transparent custom-scrollbar md:max-h-[60vh] max-h-[25vh] w-full px-1"
            :class="{ 'md:h-6': !prompt }"
            @input="autoResize"
            @keydown.enter="handleEnter"
            @paste="handlePaste"
        />
        <div class="flex items-center justify-between gap-2 w-full">
            <div class="flex items-center gap-2">
                <UiSelector
                    v-model="selectedModel"
                    :options="modelOptions"
                    :direction="chatId ? 'up' : 'down'"
                    has-custom-model
                />
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    class="hidden"
                    @change="handleFileChange"
                />
                <button
                    class="size-11 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all border border-default shrink-0"
                    type="button"
                    :aria-label="$t('chat.addAttachment')"
                    :title="$t('chat.addAttachment')"
                    @click="triggerFileInput"
                >
                    <Icon name="lucide:plus" class="size-5" />
                </button>
            </div>
            <button
                v-if="chatStore.isGenerating"
                class="size-11 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all border border-default shrink-0"
                type="button"
                :aria-label="$t('chat.stop')"
                :title="$t('chat.stop')"
                @click="chatStore.stopGeneration"
            >
                <Icon name="lucide:square" class="size-5 fill-current" />
            </button>
            <button
                v-else
                class="size-11 bg-(--ui-background) text-(--ui-text-second) flex items-center justify-center rounded-full hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-default border border-default shrink-0"
                :disabled="!prompt && attachments.length === 0"
                type="button"
                :aria-label="$t('chat.send')"
                :title="$t('chat.send')"
                @click="sendRequest"
            >
                <Icon name="lucide:send" class="size-5" />
            </button>
        </div>
    </motion.div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUIStore } from "~/stores/ui";
import { useChatStore } from "~/stores/chat";
import type { ChatMessage, ContentPart } from "~/types/openrouter";
import { motion } from "motion-v";

const { t } = useI18n();

const uiStore = useUIStore();
const chatStore = useChatStore();
const { selectedModel, modelOptions } = storeToRefs(uiStore);

const props = defineProps<{
    chatId?: number;
}>();

const prompt = ref("");
const textarea = ref<HTMLTextAreaElement | null>(null);

interface Attachment {
    name: string;
    mimeType: string;
    data: string;
    previewUrl: string;
}

const attachments = ref<Attachment[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    processFiles(Array.from(target.files));
    target.value = "";
};

const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (const item of Array.from(items)) {
        if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) files.push(file);
        }
    }

    if (files.length > 0) {
        processFiles(files);
    }
};

const processFiles = (files: File[]) => {
    const MAX_TOTAL_SIZE = 1.5 * 1024 * 1024;
    let currentTotalSize = attachments.value.reduce(
        (acc, att) => acc + att.data.length * 0.75,
        0,
    );

    for (const file of files) {
        if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
            alert(t("chat.fileTooLarge", { max: "1.5MB" }));
            break;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Url = e.target?.result as string;
            if (base64Url) {
                const base64Data = base64Url.split(",")[1];
                if (base64Data) {
                    attachments.value.push({
                        name: file.name,
                        mimeType: file.type || "application/octet-stream",
                        data: base64Data,
                        previewUrl: base64Url,
                    });
                    currentTotalSize += file.size;
                }
            }
        };
        reader.onerror = () => {
            console.error(`Failed to read file: ${file.name}`);
        };
        reader.readAsDataURL(file);
    }
};

const removeAttachment = (index: number) => {
    attachments.value.splice(index, 1);
};

const sendRequest = async () => {
    if (!prompt.value && attachments.value.length === 0) return;

    const requestParts: ContentPart[] = [];
    if (prompt.value) {
        requestParts.push({ text: prompt.value });
    }
    if (attachments.value.length > 0) {
        attachments.value.forEach((att) => {
            requestParts.push({
                inlineData: {
                    mimeType: att.mimeType,
                    data: att.data,
                },
            });
        });
    }

    const userMessage: ChatMessage = {
        id: Date.now(),
        role: "user",
        parts: requestParts,
        timestamp: new Date().toISOString(),
        status: "pending",
        model: selectedModel.value,
    };

    const originalPrompt = prompt.value;
    const originalAttachments = [...attachments.value];
    prompt.value = "";
    attachments.value = [];

    try {
        const targetId = await chatStore.sendMessage(userMessage, props.chatId);
        if (!props.chatId) {
            await navigateTo(`/chat/${targetId}`);
        }
    } catch (error) {
        prompt.value = originalPrompt;
        attachments.value = originalAttachments;
        console.error("Failed to send message:", error);
    }
};

const handleEnter = (e: KeyboardEvent) => {
    if (e.isComposing) return;
    if (!e.shiftKey) {
        e.preventDefault();
        sendRequest();
    }
};

const autoResize = () => {
    if (textarea.value) {
        textarea.value.style.height = "auto";
        textarea.value.style.height = textarea.value.scrollHeight + "px";
    }
};

watch(prompt, (newVal) => {
    if (!newVal) {
        if (textarea.value) textarea.value.style.height = "";
    }
});

</script>
