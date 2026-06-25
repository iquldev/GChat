import { defineStore, skipHydrate } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { ref, computed, watch, type Ref } from "vue";
import { useUIStore } from "@/stores/ui";
import type { ChatMessage, Chat, TextPart } from "@/types/openrouter";

export const useChatStore = defineStore("chat", () => {
  const chats = useLocalStorage<Chat[]>("gchat:chats", [], { deep: true });
  const selectedChatId = useLocalStorage<number | null>(
    "gchat:selectedChatId",
    null,
  );

  const isGenerating: Ref<boolean> = ref(false);
  let abortController: AbortController | null = null;

  const selectedChat = computed<Chat | undefined>(() =>
    chats.value.find((chat: Chat) => chat.id === selectedChatId.value),
  );

  watch(
    () => chats.value.length,
    () => {
      if (
        selectedChatId.value &&
        !chats.value.some((chat: Chat) => chat.id === selectedChatId.value)
      ) {
        selectedChatId.value = null;
      }
    },
  );

  const addChat = (firstMessage: ChatMessage): number => {
    const newId = Date.now();
    const textPart = firstMessage.parts.find((p) => "text" in p) as
      | TextPart
      | undefined;
    const titleText = textPart?.text || "New Chat";

    const newChat: Chat = {
      id: newId,
      title: titleText.slice(0, 30) + (titleText.length > 30 ? "..." : ""),
      content: [JSON.parse(JSON.stringify(firstMessage))],
    };

    chats.value = [...chats.value, newChat];
    return newId;
  };

  const addMessage = (chatId: number, message: ChatMessage): void => {
    const chat = chats.value.find((c) => c.id === chatId);
    if (chat) {
      chat.content.push(message);
    }
  };

  const sendMessage = async (
    message: ChatMessage,
    chatId?: number,
  ): Promise<number | undefined> => {
    if (isGenerating.value) return;

    let targetChatId = chatId;
    if (!targetChatId) {
      targetChatId = addChat(message);
    } else {
      addMessage(targetChatId, message);
    }

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "model",
      parts: [{ text: "" }],
      timestamp: new Date().toISOString(),
      status: "pending",
      model: message.model,
    };
    addMessage(targetChatId, aiMessage);

    processResponse(targetChatId, message, aiMessage);

    return targetChatId;
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
      isGenerating.value = false;
    }
  };

  const processResponse = async (
    targetChatId: number,
    userMessage: ChatMessage,
    aiMessage: ChatMessage,
  ): Promise<void> => {
    isGenerating.value = true;
    abortController = new AbortController();

    const uiStore = useUIStore();

    try {
      const chat = chats.value.find((c) => c.id === targetChatId);
      if (!chat) throw new Error("Chat not found in store");

      const messages = chat.content
        .filter((m) => {
          if (m.role === "user") return true;
          if (m.role === "model" && m.status === "received") return true;
          return false;
        })
        .map((m) => ({
          role: (m.role === "model" ? "assistant" : m.role) as
            | "user"
            | "assistant"
            | "system",
          parts: m.parts
            .map((p) => {
              if ("text" in p) {
                return p.text ? { text: p.text } : null;
              }
              if ("inlineData" in p) {
                return { inlineData: p.inlineData };
              }
              return null;
            })
            .filter((p): p is NonNullable<typeof p> => p !== null),
        }))
        .filter((m) => m.parts.length > 0);

      if (uiStore.customSystemPrompt) {
        messages.unshift({
          role: "system",
          parts: [{ text: uiStore.customSystemPrompt }],
        });
      }

      const payload = {
        model: userMessage.model,
        temperature: uiStore.aiTemperature,
        max_tokens: uiStore.aiMaxTokens,
        content: messages,
        hasCustomSystemPrompt: !!uiStore.customSystemPrompt,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      };

      if (uiStore.userApiKey) {
        headers["Authorization"] = `Bearer ${uiStore.userApiKey}`;
      }

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg =
          errorData.statusMessage ||
          errorData.message ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      if (!response.body) {
        throw new Error("Response body is not available");
      }

      // If server provided model in response headers, use it (server may override requested model)
      const serverModel = response.headers.get('x-model') || response.headers.get('X-Model');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const userMsgInStore = chat.content.find((m) => m.id === userMessage.id);
      if (userMsgInStore) userMsgInStore.status = "sent";

      const msgInStore = chat.content.find((m) => m.id === aiMessage.id);
      if (msgInStore) {
        msgInStore.status = "streaming";
        if (serverModel) {
          msgInStore.model = serverModel;
        }
      }

      let accumulatedText = "";
      let lastUpdateTime = 0;
      let updateTimeout: ReturnType<typeof setTimeout> | null = null;

      const flushUpdate = () => {
        if (msgInStore) {
          const lastPart = msgInStore.parts[msgInStore.parts.length - 1];
          if (lastPart && "text" in lastPart) {
            lastPart.text = accumulatedText;
          } else {
            msgInStore.parts.push({ text: accumulatedText });
          }
        }
      };

      while (reader) {
        const { done, value } = await reader.read();
        if (done) {
          if (updateTimeout) clearTimeout(updateTimeout);
          flushUpdate();
          if (msgInStore) msgInStore.status = "received";

          if (uiStore.soundEnabled) {
            try {
              const AudioContextClass =
                window.AudioContext ||
                (
                  window as Window & {
                    webkitAudioContext?: typeof AudioContext;
                  }
                ).webkitAudioContext;
              if (AudioContextClass) {
                const context = new AudioContextClass();
                const oscillator = context.createOscillator();
                const gain = context.createGain();
                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(880, context.currentTime);
                gain.gain.setValueAtTime(0.1, context.currentTime);
                gain.gain.exponentialRampToValueAtTime(
                  0.01,
                  context.currentTime + 0.1,
                );
                oscillator.connect(gain);
                gain.connect(context.destination);
                oscillator.start();
                oscillator.stop(context.currentTime + 0.1);

                setTimeout(() => context.close(), 200);
              }
            } catch (e) {
              console.error("Failed to play notification sound:", e);
            }
          }
          break;
        }

        let chunk = decoder.decode(value);

        // Detect model control token emitted by server like [MODEL:...]
        const modelRegex = /\[MODEL:([^\]]+)\]/g;
        let m: RegExpExecArray | null;
        while ((m = modelRegex.exec(chunk)) !== null) {
          const modelName = m[1];
          if (msgInStore) msgInStore.model = modelName;
        }
        // Remove any model tokens from the chunk before appending
        chunk = chunk.replace(/\[MODEL:[^\]]+\]/g, '');

        accumulatedText += chunk;

        const now = Date.now();
        if (now - lastUpdateTime > 60) {
          if (updateTimeout) clearTimeout(updateTimeout);
          flushUpdate();
          lastUpdateTime = now;
        } else if (!updateTimeout) {
          updateTimeout = setTimeout(() => {
            flushUpdate();
            lastUpdateTime = Date.now();
            updateTimeout = null;
          }, 60);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        const chat = chats.value.find((c) => c.id === targetChatId);
        const msgInStore = chat?.content.find((m) => m.id === aiMessage.id);
        if (msgInStore) msgInStore.status = "received";
        return;
      }

      console.error(error);
      const message = error instanceof Error ? error.message : "Unknown error";

      const chat = chats.value.find((c) => c.id === targetChatId);
      const userMsgInStore: ChatMessage | undefined = chat?.content.find(
        (m) => m.id === userMessage.id,
      );
      if (userMsgInStore) {
        userMsgInStore.status = "error";
      }

      const msgInStore: ChatMessage | undefined = chat?.content.find(
        (m) => m.id === aiMessage.id,
      );
      if (msgInStore) {
        msgInStore.status = "error";
        msgInStore.parts = [{ text: `Error: ${message}` }];
      }
    } finally {
      isGenerating.value = false;
      abortController = null;
    }
  };

  const deleteChat = (id: number) => {
    const wasSelected = selectedChatId.value === id;
    chats.value = chats.value.filter((chat) => chat.id !== id);
    if (wasSelected) {
      selectedChatId.value = null;
      navigateTo("/");
    }
  };

  const retryMessage = (chatId: number, aiMessageId: number) => {
    const chat = chats.value.find((c) => c.id === chatId);
    if (!chat) return;

    const aiMessageIndex = chat.content.findIndex((m) => m.id === aiMessageId);
    if (aiMessageIndex <= 0) return;

    const aiMessage = chat.content[aiMessageIndex];
    if (
      !aiMessage ||
      aiMessage.role !== "model" ||
      aiMessage.status !== "error"
    )
      return;

    let userMessage: ChatMessage | null = null;
    for (let i = aiMessageIndex - 1; i >= 0; i--) {
      const msg = chat.content[i];
      if (msg && msg.role === "user") {
        userMessage = msg;
        break;
      }
    }

    if (!userMessage) return;

    aiMessage.status = "pending";
    aiMessage.parts = [{ text: "" }];

    processResponse(chatId, userMessage, aiMessage);
  };

  const renameChat = (id: number, newTitle: string) => {
    const chat = chats.value.find((c) => c.id === id);
    if (chat) {
      const trimmed = newTitle.trim();
      if (trimmed.length > 0) {
        chat.title = trimmed.slice(0, 30) + (trimmed.length > 30 ? "..." : "");
      }
    }
  };

  const changeSelected = (id: number) => {
    selectedChatId.value = id;
  };

  const removeSelection = () => {
    selectedChatId.value = null;
  };

  const clearAllChats = () => {
    chats.value = [];
    selectedChatId.value = null;
    navigateTo("/");
  };

  const exportChats = () => {
    const data = JSON.stringify(chats.value, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gchat-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importChats = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          chats.value = [...chats.value, ...imported];
        }
      } catch (error) {
        console.error("Failed to import chats:", error);
      }
    };
    reader.readAsText(file);
  };

  return {
    chats: skipHydrate(chats),
    selectedChatId: skipHydrate(selectedChatId),
    selectedChat,
    isGenerating,
    addChat,
    sendMessage,
    stopGeneration,
    changeSelected,
    removeSelection,
    deleteChat,
    renameChat,
    retryMessage,
    clearAllChats,
    exportChats,
    importChats,
  };
});
