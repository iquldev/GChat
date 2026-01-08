import { defineStore } from "pinia";

export interface Chat {
  id: number;
  title: string;
  isSelected: boolean;
}

export const useChatStore = defineStore("chat", () => {
  const chats = ref<Chat[]>([
    {
      id: 1,
      title:
        "The connections we build with others often define our experiences.",
      isSelected: false,
    },
    {
      id: 2,
      title: "Isn't it amazing how music can evoke such strong emotions?",
      isSelected: false,
    },
    {
      id: 3,
      title: "Curiosity often leads to the most profound discoveries.",
      isSelected: false,
    },
    {
      id: 4,
      title: "Curiosity often leads to the most profound discoveries.",
      isSelected: false,
    },
    {
      id: 5,
      title: "Curiosity often leads to the most profound discoveries.",
      isSelected: false,
    },
    {
      id: 6,
      title: "Curiosity often leads to the most profound discoveries.",
      isSelected: false,
    },
  ]);

  const changeSelected = (id: number) => {
    chats.value = chats.value.map((chat) => {
      if (chat.id === id) {
        chat.isSelected = true;
      } else {
        chat.isSelected = false;
      }
      return chat;
    });
  };

  const removeSelection = () => {
    chats.value = chats.value.map((chat) => {
      chat.isSelected = false;
      return chat;
    });
  };

  return {
    chats,
    changeSelected,
    removeSelection,
  };
});
