import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { authClient } from '@/lib/auth-client';
import type { ChatMessage, Chat, TextPart } from '@/types/openrouter';

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const selectedChatId = ref<string | null>(null);
  const isGenerating = ref(false);

  let abortController: AbortController | null = null;
  const uiStore = useUIStore();

  const initSession = async () => {
    const { data: sessionData } = await authClient.useSession(useFetch);

    watch(
      sessionData,
      async (newSession) => {
        if (newSession) {
          await fetchUserChats();
        } else {
          chats.value = [];
          selectedChatId.value = null;
        }
      },
      { immediate: true },
    );
  };

  initSession();

  const selectedChat = computed<Chat | undefined>(() =>
    chats.value.find((chat) => chat.id === selectedChatId.value),
  );

  watch(
    () => chats.value.map((c) => c.id),
    (newIds) => {
      if (
        selectedChatId.value &&
        !newIds.includes(selectedChatId.value)
      ) {
        selectedChatId.value = null;
      }
    },
  );

  const fetchUserChats = async () => {
    chats.value = [];
    selectedChatId.value = null;

    try {
      chats.value = await $fetch<Chat[]>('/api/chats');
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  };

  const addChat = async (firstMessage: ChatMessage): Promise<string> => {
    const textPart = firstMessage.parts.find((p) => 'text' in p) as
      | TextPart
      | undefined;
    const titleText = textPart?.text || 'New Chat';
    const title = titleText.slice(0, 30) + (titleText.length > 30 ? '...' : '');

    const tempId = `temp_${Date.now()}`;
    const newChat: Chat = {
      id: tempId,
      title,
      content: [JSON.parse(JSON.stringify(firstMessage))],
    };

    chats.value = [...chats.value, newChat];

    try {
      const savedChat = await $fetch<Chat>('/api/chats', {
        method: 'POST',
        body: { title, firstMessage },
      });

      const chatIndex = chats.value.findIndex((c) => c.id === tempId);
      if (chatIndex !== -1) {
        chats.value[chatIndex]!.id = savedChat.id;
      }
      selectedChatId.value = savedChat.id;
      return savedChat.id;
    } catch (err) {
      console.error('Save error:', err);
      chats.value = chats.value.filter((c) => c.id !== tempId);
      throw err;
    }
  };

  const addMessage = async (chatId: string, message: ChatMessage) => {
    const chat = chats.value.find((c) => c.id === chatId);
    if (!chat) return;

    chat.content.push(message);

    try {
      await $fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: { message },
      });
    } catch (err) {
      console.error('Save failed:', err);
      const idx = chat.content.findIndex((m) => m.id === message.id);
      if (idx !== -1) chat.content.splice(idx, 1);
      throw err;
    }
  };

  const saveMessageToBackend = async (chatId: string, message: ChatMessage) => {
    try {
      await $fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: { message },
      });
    } catch (err) {
      console.error('Save failed:', err);
      throw err;
    }
  };

  const sendMessage = async (message: ChatMessage, chatId?: string) => {
    if (isGenerating.value) return;

    let targetChatId: string;
    if (chatId) {
      targetChatId = chatId;
      await addMessage(targetChatId, message);
    } else {
      targetChatId = await addChat(message);
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      parts: [{ text: '' }],
      timestamp: new Date().toISOString(),
      status: 'pending',
      model: message.model,
    };

    const chat = chats.value.find((c) => c.id === targetChatId);
    if (chat) chat.content.push(aiMessage);

    processResponse(targetChatId, message, aiMessage);
    return targetChatId;
  };

  const processResponse = async (
    targetChatId: string,
    userMessage: ChatMessage,
    aiMessage: ChatMessage,
  ) => {
    isGenerating.value = true;
    abortController = new AbortController();

    try {
      const chat = chats.value.find((c) => c.id === targetChatId);
      if (!chat) throw new Error('Chat not found in store');

      const messages = chat.content
        .filter(
          (m) =>
            m.role === 'user' ||
            (m.role === 'model' && m.status === 'received'),
        )
        .map((m) => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          parts: m.parts.filter((p) => 'text' in p || 'inlineData' in p),
        }));

      if (uiStore.customSystemPrompt) {
        messages.unshift({
          role: 'system',
          parts: [{ text: uiStore.customSystemPrompt }],
        });
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      };
      if (uiStore.userApiKey) {
        headers['Authorization'] = `Bearer ${uiStore.userApiKey}`;
      }

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: userMessage.model,
          temperature: uiStore.aiTemperature,
          max_tokens: uiStore.aiMaxTokens,
          content: messages,
          hasCustomSystemPrompt: !!uiStore.customSystemPrompt,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      if (!response.body) throw new Error('Response body is not available');

      const serverModel =
        response.headers.get('x-model') || response.headers.get('X-Model');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const userMsg = chat.content.find((m) => m.id === userMessage.id);
      if (userMsg) userMsg.status = 'sent';

      const msgInStore = chat.content.find((m) => m.id === aiMessage.id);
      if (msgInStore) {
        msgInStore.status = 'streaming';
        if (serverModel) msgInStore.model = serverModel;
      }

      let accumulatedText = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) {
          if (msgInStore) {
            msgInStore.status = 'received';
            await saveMessageToBackend(targetChatId, msgInStore);
          }
          playNotificationSound();
          break;
        }

        let chunk = decoder.decode(value);

        const modelMatch = /\[MODEL:([^\]]+)\]/.exec(chunk);
        if (modelMatch && msgInStore) {
          msgInStore.model = modelMatch[1];
        }
        chunk = chunk.replace(/\[MODEL:[^\]]+\]/g, '');

        accumulatedText += chunk;

        if (msgInStore) {
          msgInStore.parts = [{ text: accumulatedText }];
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        const chat = chats.value.find((c) => c.id === targetChatId);
        const msgInStore = chat?.content.find((m) => m.id === aiMessage.id);
        if (msgInStore) {
          msgInStore.status = 'received';
          await saveMessageToBackend(targetChatId, msgInStore);
        }
        return;
      }
      handleStreamError(targetChatId, userMessage.id, aiMessage.id, error);
    } finally {
      isGenerating.value = false;
      abortController = null;
    }
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
      isGenerating.value = false;
    }
  };

  const deleteChat = async (id: string) => {
    const wasSelected = selectedChatId.value === id;
    const deletedChat = chats.value.find((chat) => chat.id === id);
    const prevChats = chats.value.slice();
    chats.value = chats.value.filter((chat) => chat.id !== id);

    if (wasSelected) {
      selectedChatId.value = null;
      navigateTo('/');
    }

    try {
      await $fetch(`/api/chats/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting chat:', err);
      if (deletedChat) chats.value = prevChats;
      if (wasSelected) selectedChatId.value = id;
      throw err;
    }
  };

  const renameChat = async (id: string, newTitle: string) => {
    const chat = chats.value.find((c) => c.id === id);
    const trimmed = newTitle.trim();
    if (!chat || trimmed.length === 0) return;

    const oldTitle = chat.title;
    chat.title = trimmed.slice(0, 30) + (trimmed.length > 30 ? '...' : '');

    try {
      await $fetch(`/api/chats/${id}`, {
        method: 'PATCH',
        body: { title: chat.title },
      });
    } catch (err) {
      console.error('Error renaming chat:', err);
      chat.title = oldTitle;
      throw err;
    }
  };

  const clearAllChats = async () => {
    const prevChats = chats.value.slice();
    const prevSelected = selectedChatId.value;
    const chatIds = chats.value.map((chat) => chat.id);

    try {
      await Promise.all(
        chatIds.map((id) => $fetch(`/api/chats/${id}`, { method: 'DELETE' })),
      );
      chats.value = [];
      selectedChatId.value = null;
      navigateTo('/');
    } catch (err) {
      console.error('Error clearing chats:', err);
      chats.value = prevChats;
      selectedChatId.value = prevSelected;
      if (prevSelected) navigateTo(`/chat/${prevSelected}`);
      throw err;
    }
  };

  const handleStreamError = (
    chatId: string,
    userMsgId: string | number,
    aiMsgId: string | number,
    error: unknown,
  ) => {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    const chat = chats.value.find((c) => c.id === chatId);

    if (chat) {
      const userMsg = chat.content.find((m) => m.id === userMsgId);
      if (userMsg) userMsg.status = 'error';

      const aiMsg = chat.content.find((m) => m.id === aiMsgId);
      if (aiMsg) {
        aiMsg.status = 'error';
        aiMsg.parts = [{ text: `Error: ${errMsg}` }];
      }
    }
  };

  interface ExtendedWindow extends Window {
    webkitAudioContext?: typeof AudioContext;
  }

  const playNotificationSound = () => {
    if (!uiStore.soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as ExtendedWindow).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);

      setTimeout(() => ctx.close(), 200);
    } catch (e) {
      console.error('Sound error:', e);
    }
  };

  const retryMessage = (chatId: string, aiMessageId: string | number) => {
    if (isGenerating.value) return;

    const chat = chats.value.find((c) => c.id === chatId);
    if (!chat) return;

    const aiIndex = chat.content.findIndex((m) => m.id === aiMessageId);
    if (aiIndex <= 0) return;

    const aiMessage = chat.content[aiIndex];
    const userMessage = chat.content[aiIndex - 1];

    if (!aiMessage || !userMessage || userMessage.role !== 'user') return;

    aiMessage.status = 'pending';
    aiMessage.parts = [{ text: '' }];

    processResponse(chatId, userMessage, aiMessage);
  };

  const changeSelected = (id: string) => {
    selectedChatId.value = id;
  };
  const removeSelection = () => {
    selectedChatId.value = null;
  };

  return {
    chats,
    selectedChatId,
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
  };
});
