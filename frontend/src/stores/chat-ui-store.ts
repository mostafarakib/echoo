import { create } from "zustand";
import { Chat } from "@/types/chat";

interface ChatUIState {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
}));
