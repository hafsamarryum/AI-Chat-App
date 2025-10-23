import { create } from 'zustand'
import { persist } from "zustand/middleware"


interface User {
  id: string
  email: string
}

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  model?: string;
  createdAt: Date;
  userId?: string; // optional
}

interface ChatStore {
  user: User | null;
  setUser: (user: User | null) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((msgs: Message[]) => Message[])) => void;
  addMessage: (message: Message) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      messages: [],
      setMessages: (updater) =>
        set((state) => ({
          messages:
            typeof updater === "function"
              ? updater(state.messages)
              : updater,
        })),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      selectedModel: "gpt-3.5-turbo",
      setSelectedModel: (model) => set({ selectedModel: model }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        user: state.user,
        messages: state.messages,
        selectedModel: state.selectedModel,
      }),
    }
  )
);