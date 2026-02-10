import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

type MessageRole = "user" | "model";
type MessageStatus = "sent" | "received" | "error" | "pending";

export interface Message {
  id: number;
  role: MessageRole;
  content: string;
  timestamp: string;
  status: MessageStatus;
  model: string;
}

export interface Chat {
  id: number;
  title: string;
  content: Message[];
}

export const useChatStore = defineStore("chat", () => {
  const chats = ref<Chat[]>([
    {
      id: 1,
      title:
        "The connections we build with others often define our experiences.",
      content: [
        {
          id: 1,
          role: "user",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui nunc,  pharetra vitae tristique eget, sollicitudin nec quam. Phasellus mattis  lacinia placerat. Nullam sit amet mi ligula.",
          timestamp: new Date().toISOString(),
          status: "sent",
          model: "gemini-3-flash",
        },
        {
          id: 2,
          role: "model",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui nunc,  pharetra vitae tristique eget, sollicitudin nec quam. Phasellus mattis  lacinia placerat. Nullam sit amet mi ligula.",
          timestamp: new Date().toISOString(),
          status: "received",
          model: "gemini-3-flash",
        },
        {
          id: 3,
          role: "user",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui nunc,  pharetra vitae tristique eget, sollicitudin nec quam. Phasellus mattis  lacinia placerat. Nullam sit amet mi ligula.",
          timestamp: new Date().toISOString(),
          status: "error",
          model: "gemini-3-flash",
        },
        {
          id: 4,
          role: "user",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui nunc,  pharetra vitae tristique eget, sollicitudin nec quam. Phasellus mattis  lacinia placerat. Nullam sit amet mi ligula.",
          timestamp: new Date().toISOString(),
          status: "pending",
          model: "gemini-3-flash",
        },
      ],
    },
    {
      id: 2,
      title:
        "The connections we build with others often define our experiences.",
      content: [
        {
          id: 1,
          role: "user",
          content: "Hello",
          timestamp: new Date().toISOString(),
          status: "sent",
          model: "gemini-3-flash",
        },
      ],
    },
    {
      id: 3,
      title:
        "The connections we build with others often define our experiences.",
      content: [
        {
          id: 1,
          role: "user",
          content: "Hello",
          timestamp: new Date().toISOString(),
          status: "sent",
          model: "gemini-3-flash",
        },
      ],
    },
  ]);

  const selectedChatId = useLocalStorage<number | null>("selectedChatId", null);

  const selectedChat = computed(() =>
    chats.value.find((chat) => chat.id === selectedChatId.value),
  );

  watch(
    chats,
    (newChats) => {
      if (
        selectedChatId.value &&
        !newChats.find((chat) => chat.id === selectedChatId.value)
      ) {
        selectedChatId.value = null;
      }
    },
    { immediate: true, deep: true },
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
