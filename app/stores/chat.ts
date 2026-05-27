import { defineStore, skipHydrate } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { ChatMessage, Chat, TextPart } from "@/types/gemini";

export const useChatStore = defineStore("chat", () => {
  const chats = useLocalStorage<Chat[]>("gchat:chats", [], { deep: true });
  const selectedChatId = useLocalStorage<number | null>(
    "gchat:selectedChatId",
    null,
  );

  const selectedChat = computed(() =>
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

  const addChat = (firstMessage: ChatMessage) => {
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

  const addMessage = (chatId: number, message: ChatMessage) => {
    const chat = chats.value.find((c) => c.id === chatId);
    if (chat) {
      chat.content.push(message);
    }
  };

  const sendMessage = async (message: ChatMessage, chatId?: number) => {
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

  const processResponse = async (
    targetChatId: number,
    userMessage: ChatMessage,
    aiMessage: ChatMessage,
  ) => {
    try {
      const chat = chats.value.find((c) => c.id === targetChatId);
      if (!chat) throw new Error("Chat not found in store");

      const payload = {
        model: userMessage.model,
        content: chat.content
          .filter((m) => {
            if (m.role === "user") return true;
            if (m.role === "model" && m.status === "received") return true;
            return false;
          })
          .map((m) => ({
            role: m.role,
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
          .filter((m) => m.parts.length > 0),
      };

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
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
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const userMsgInStore = chat.content.find((m) => m.id === userMessage.id);
      if (userMsgInStore) userMsgInStore.status = "sent";

      const msgInStore = chat.content.find((m) => m.id === aiMessage.id);
      if (msgInStore) msgInStore.status = "streaming";

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
          break;
        }

        const chunk = decoder.decode(value);
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

  return {
    chats: skipHydrate(chats),
    selectedChatId: skipHydrate(selectedChatId),
    selectedChat,
    addChat,
    sendMessage,
    changeSelected,
    removeSelection,
    deleteChat,
    renameChat,
    retryMessage,
  };
});
