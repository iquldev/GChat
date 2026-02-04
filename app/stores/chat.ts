import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export interface Chat {
  id: number;
  title: string;
}

export const useChatStore = defineStore("chat", () => {
  const chats = ref<Chat[]>([
    {
      id: 1,
      title:
        "The connections we build with others often define our experiences.",
    },
    {
      id: 2,
      title: "Isn't it amazing how music can evoke such strong emotions?",
    },
    { id: 3, title: "Curiosity often leads to the most profound discoveries." },
    {
      id: 14,
      title: "Curiosity often leads to the most profound discoveries.",
    },
    {
      id: 15,
      title: "Curiosity often leads to the most profound discoveries.",
    },
    {
      id: 16,
      title: "Curiosity often leads to the most profound discoveries.",
    },
    {
      id: 17,
      title: "Curiosity often leads to the most profound discoveries.",
    },
    {
      id: 18,
      title: "Curiosity often leads to the most profound discoveries.",
    },
    {
      id: 19,
      title: "Curiosity often leads to the most profound discoveries.",
    },
    {
      id: 20,
      title: "Curiosity often leads to the most profound discoveries.",
    },
  ]);

  const selectedChatId = useLocalStorage<number | null>("selectedChatId", null);

  const selectedChat = computed(() =>
    chats.value.find((chat) => chat.id === selectedChatId.value),
  );

  const changeSelected = (id: number) => {
    selectedChatId.value = id;
  };

  const removeSelection = () => {
    selectedChatId.value = null;
  };

  return {
    chats,
    selectedChatId,
    selectedChat,
    changeSelected,
    removeSelection,
  };
});
