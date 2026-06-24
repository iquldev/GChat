<template>
    <div
        class="flex w-full px-2 md:px-4"
        :class="role === 'user' ? 'justify-end' : 'justify-start'"
    >
        <div class="flex gap-4 max-w-[95%] md:max-w-[85%] min-w-0">
            <div class="flex flex-col gap-1.5 flex-1 min-w-0" :class="role === 'user' ? 'items-end' : 'items-start'">
                <MessageContent :message="message" :paragraphs="paragraphs" :attachments="attachments" :is-blur-disabled="isBlurDisabled" :role="role" />
                <MessageFooter
                  :message="message"
                  :role="role"
                  :sender="sender"
                  :status="status"
                  :status-color="statusColor"
                  
                  :copied="copied"
                  @retry="$emit('retry')"
                  @copy="copyText"
                />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import type { ChatMessage } from "~/types/openrouter";
import { useUIStore } from "~/stores/ui";
import { storeToRefs } from "pinia";
import MessageContent from './MessageContent.vue';
import MessageFooter from './MessageFooter.vue';

const props = defineProps({
    message: {
        type: Object as () => ChatMessage,
        required: true,
    },
});

defineEmits(["retry"]);

const uiStore = useUIStore();
const { isBlurDisabled } = storeToRefs(uiStore);

const { t } = useI18n();


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

</script>
