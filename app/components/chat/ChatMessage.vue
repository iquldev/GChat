<template>
    <div
        class="flex w-full px-2 md:px-4"
        :class="role === 'user' ? 'justify-end' : 'justify-start'"
    >
        <div class="flex gap-4 max-w-[95%] md:max-w-[85%] min-w-0">
            <div
                class="flex flex-col gap-1.5 flex-1 min-w-0"
                :class="role === 'user' ? 'items-end' : 'items-start'"
            >
                <div
                    class="py-4 transition-colors duration-200 wrap-break-word overflow-hidden"
                    :class="[
                        role === 'user'
                            ? 'bg-(--ui-block-background) border border-default shadow-xs px-6 rounded-2xl w-full'
                            : 'px-2 md:px-0',
                        {
                            'disable-blur': isBlurDisabled,
                            'no-animation':
                                message.status !== 'received' &&
                                message.status !== 'streaming' &&
                                message.role === 'model',
                            'border-(--ui-error)/50 bg-(--ui-error)/10 rounded-2xl px-6':
                                message.status === 'error',
                        },
                    ]"
                >
                    <TransitionGroup
                        name="stream"
                        tag="div"
                        class="flex flex-col gap-[0.85rem] md:text-[17px] text-[15px] leading-relaxed wrap-break-word message-body"
                        :class="{
                            'animate-text-shimmer':
                                message.status === 'pending',
                        }"
                    >
                        <template
                            v-if="
                                message.status === 'pending' &&
                                message.role === 'model'
                            "
                        >
                            <div class="flex flex-col gap-2">
                                <div
                                    class="h-4 w-48 bg-(--ui-text-second)/20 rounded-sm animate-pulse"
                                />
                                <div
                                    class="h-4 w-32 bg-(--ui-text-second)/20 rounded-sm animate-pulse"
                                />
                            </div>
                        </template>
                        <div
                            v-if="attachments.length > 0"
                            key="attachments"
                            class="flex flex-wrap gap-2"
                        >
                            <template
                                v-for="(att, i) in attachments"
                                :key="'att-' + i"
                            >
                                <img
                                    v-if="att?.mimeType.startsWith('image/')"
                                    :src="att.url"
                                    :alt="`Attachment ${i + 1}`"
                                    class="max-w-50 h-auto rounded-xl border border-default object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    @click="fullscreenImage = att.url"
                                />
                                <div
                                    v-else
                                    class="w-50 h-25 rounded-xl border border-default flex flex-col items-center justify-center bg-(--ui-background) text-sm p-2"
                                >
                                    <Icon
                                        name="lucide:file"
                                        class="w-8 h-8 mb-2 text-(--ui-text-second)"
                                    />
                                    <span
                                        class="text-xs text-center font-bold"
                                        >{{
                                            att?.mimeType
                                                .split("/")[1]
                                                ?.toUpperCase() || "FILE"
                                        }}</span
                                    >
                                </div>
                            </template>
                        </div>
                        <MarkdownContent
                            v-for="(para, index) in paragraphs"
                            :key="index"
                            :content="para"
                            :is-streaming="
                                message.status === 'streaming' &&
                                index === paragraphs.length - 1
                            "
                        />
                    </TransitionGroup>
                </div>
                <div
                    class="text-[11px] flex gap-2 w-full px-1"
                    :class="role === 'user' ? 'justify-end' : 'justify-start'"
                >
                    <div
                        class="font-medium text-(--ui-text-second) opacity-70 flex gap-2 items-center"
                    >
                        <span class="uppercase tracking-wider">{{
                            sender
                        }}</span>
                        <template v-if="message.status">
                            <span class="opacity-30">•</span>
                            <Icon
                                v-if="
                                    message.status !== 'received' &&
                                    message.status !== 'streaming'
                                "
                                :name="status"
                                class="shrink-0 size-3.5"
                                :class="[
                                    statusColor,
                                    {
                                        'animate-spin':
                                            message.status === 'pending',
                                    },
                                ]"
                            />
                            <span
                                v-else-if="
                                    message.status === 'received' ||
                                    message.status === 'streaming'
                                "
                                class="message-status-text shrink-0 opacity-80"
                            >
                                {{ status }}
                            </span>
                        </template>
                        <span class="opacity-30">•</span>
                        <span class="whitespace-nowrap">{{
                            formatDate(message.timestamp)
                        }}</span>
                    </div>

                    <div
                        class="text-(--ui-text-second) flex gap-1 items-center"
                        :class="role === 'user' ? 'mr-auto' : 'ml-auto'"
                    >
                        <button
                            v-if="
                                message.status === 'error' &&
                                message.role === 'model'
                            "
                            class="opacity-70 flex items-center justify-center p-1.5 rounded-md hover:bg-(--ui-block-background) hover:opacity-100 transition-all cursor-pointer"
                            :title="t('chat.retry')"
                            @click="$emit('retry')"
                        >
                            <Icon name="lucide:rotate-cw" class="size-4" />
                        </button>
                        <button
                            v-if="message.role === 'model'"
                            class="opacity-70 flex items-center justify-center p-1.5 rounded-md hover:bg-(--ui-block-background) hover:opacity-100 transition-all cursor-pointer"
                            :title="t('chat.copy')"
                            @click="copyText"
                        >
                            <Icon
                                :name="copied ? 'lucide:check' : 'lucide:copy'"
                                class="size-4"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div
                v-if="fullscreenImage"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                @click.self="fullscreenImage = null"
            >
                <button
                    class="absolute top-4 right-4 p-3 md:p-4 bg-(--ui-background) flex items-center justify-center w-fit rounded-full border border-default hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all"
                    @click="fullscreenImage = null"
                >
                    <Icon name="lucide:x" class="w-6 h-6" />
                </button>
                <button
                    class="absolute top-4 right-24 p-3 md:p-4 bg-(--ui-background) flex items-center justify-center w-fit rounded-full border border-default hover:opacity-50 hover:cursor-pointer active:opacity-50 active:scale-90 transition-all"
                    @click="downloadImage(fullscreenImage)"
                >
                    <Icon name="lucide:download" class="w-6 h-6" />
                </button>
                <img
                    :src="fullscreenImage"
                    class="max-w-full max-h-full object-contain rounded-lg"
                />
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import type { ChatMessage } from "~/types/gemini";
import { useUIStore } from "~/stores/ui";
import { storeToRefs } from "pinia";
import { formatChatMessageDate } from "~/utils/formatters";
import MarkdownContent from "./MarkdownContent.vue";

const props = defineProps({
    message: {
        type: Object as () => ChatMessage,
        required: true,
    },
});

defineEmits(["retry"]);

const uiStore = useUIStore();
const { isBlurDisabled } = storeToRefs(uiStore);

const { locale, t } = useI18n();

const fullscreenImage = ref<string | null>(null);

const downloadImage = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `attachment-${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const role = computed(() => props.message.role);

const messageText = computed(() => {
    return props.message.parts.map((p) => ("text" in p ? p.text : "")).join("");
});

const attachments = computed(() => {
    return props.message.parts
        .map((p) => {
            if ("inlineData" in p) {
                return {
                    mimeType: p.inlineData.mimeType,
                    url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`,
                };
            }
            return null;
        })
        .filter((a): a is NonNullable<typeof a> => a !== null);
});

const { copy, copied } = useClipboard();

const copyText = () => {
    copy(messageText.value);
};

const paragraphs = computed(() => {
    const text = messageText.value;
    if (!text) return [];

    const chunks: string[] = [];
    let currentChunk = "";
    let inCodeBlock = false;

    const parts = text.split(/(\n\n|```)/g);

    for (const part of parts) {
        if (part === "```") {
            inCodeBlock = !inCodeBlock;
            currentChunk += part;
        } else if (part === "\n\n" && !inCodeBlock) {
            if (currentChunk.trim()) {
                chunks.push(currentChunk);
            }
            currentChunk = "";
        } else {
            currentChunk += part;
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk);
    }

    return chunks;
});

const sender = computed(() => {
    if (role.value === "user") return t("chat.you");
    if (role.value === "model") return t("chat.ai");
    return "";
});

const status = computed(() => {
    if (props.message.status === "sent") return "lucide:check";
    if (props.message.status === "pending") return "lucide:loader";
    if (
        props.message.status === "streaming" ||
        props.message.status === "received"
    )
        return props.message.model;
    if (props.message.status === "error") return "lucide:x";
    return "";
});

const statusColor = computed(() => {
    if (props.message.status === "sent") return "text-(--ui-text-second)";
    if (
        props.message.status === "pending" ||
        props.message.status === "streaming"
    )
        return "text-(--ui-text-second)";
    if (props.message.status === "error") return "text-(--ui-error)";
    return "";
});

const formatDate = (dateString: string) => {
    return formatChatMessageDate(dateString, locale.value, {
        today: t("chat.date.today"),
        yesterday: t("chat.date.yesterday"),
    });
};
</script>
