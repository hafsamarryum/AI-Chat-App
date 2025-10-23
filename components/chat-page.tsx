"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { MessageBubble } from "./message-bubble";
import { trpc } from "@/lib/trpc-client";
import { Moon, Sun, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useTheme } from "@/lib/useTheme";
import type { Message } from "@/lib/store";

export function ChatPage() {
  const {
    user,
    messages,
    addMessage,
    setMessages,
    selectedModel,
    setSelectedModel,
    isLoading,
    setIsLoading,
  } = useChatStore();
  
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  
  const { data: models } = trpc.models.getAvailable.useQuery();
  const sendMessageMutation = trpc.chat.send.useMutation();
  
  // ✅ Auto-scroll when messages change
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);
  
  // ✅ Fetch messages + assistant responses
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_messages")
        .select("*, assistant_responses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      
      if (data) {
        const formatted: Message[] = data.flatMap(
          (msg: {
            id: string;
            content: string;
            model: string;
            created_at: string;
            assistant_responses?: {
              id: string;
              content: string;
              model: string;
              created_at: string;
            }[];
          }) => {
            const all: Message[] = [
              {
                id: msg.id,
                content: msg.content,
                role: "user" as const,
                model: msg.model,
                createdAt: new Date(msg.created_at),
                userId: user.id,
              },
            ];
            
            if (msg.assistant_responses?.length) {
              msg.assistant_responses.forEach(
                (res: {
                  id: string;
                  content: string;
                  model: string;
                  created_at: string;
                }) => {
                  all.push({
                    id: res.id,
                    content: res.content,
                    role: "assistant" as const,
                    model: res.model,
                    createdAt: new Date(res.created_at),
                    userId: user.id,
                  });
                }
              );
            }
            return all;
          }
        );
        setMessages(formatted);
      }
    };
    
    fetchMessages();
  }, [user, setMessages, supabase]);
  
  // ✅ Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;
    
    setIsLoading(true);
    
    try {
      // Save user message
      const { data: userMsg, error: userMsgError } = await supabase
        .from("user_messages")
        .insert({
          user_id: user.id,
          content: input,
          model: selectedModel,
        })
        .select()
        .single();
        
      if (userMsgError) throw userMsgError;
      
      const newUserMessage: Message = {
        id: userMsg.id,
        content: userMsg.content,
        role: "user",
        model: userMsg.model,
        createdAt: new Date(userMsg.created_at),
        userId: user.id,
      };
      addMessage(newUserMessage);
      setInput("");
      
      // Generate AI response
      const response = await sendMessageMutation.mutateAsync({
        message: input,
        model: selectedModel,
        userId: user.id,
      });
      
      // Save assistant response
      const { data: resData, error: resError } = await supabase
        .from("assistant_responses")
        .insert({
          user_id: user.id,
          user_message_id: userMsg.id,
          content: response.content,
          model: response.model,
        })
        .select()
        .single();
        
      if (resError) throw resError;
      
      const assistantMessage: Message = {
        id: resData.id,
        content: resData.content,
        role: "assistant",
        model: resData.model,
        createdAt: new Date(resData.created_at),
        userId: user.id,
      };
      addMessage(assistantMessage);
    } catch (err) {
      console.error("❌ Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✅ Edit message
  const handleEditMessage = async () => {
    if (!editingMessageId || !input.trim()) return;
    
    const { error } = await supabase
      .from("user_messages")
      .update({ content: input })
      .eq("id", editingMessageId);
      
    if (!error) {
      setMessages(
        messages.map((m: Message) =>
          m.id === editingMessageId ? { ...m, content: input } : m
        )
      );
      setEditingMessageId(null);
      setInput("");
    }
  };
  
  // ✅ Delete user message + assistant response
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    
    try {
      // 1️⃣ Find assistant response(s)
      const { data: responses, error: fetchError } = await supabase
        .from("assistant_responses")
        .select("id")
        .eq("user_message_id", messageId)
        .eq("user_id", user.id);
        
      if (fetchError) throw fetchError;
      
      // 2️⃣ Delete assistant response(s)
      if (responses && responses.length > 0) {
        const { error: deleteResError } = await supabase
          .from("assistant_responses")
          .delete()
          .in(
            "id",
            responses.map((r) => r.id)
          );
        if (deleteResError) throw deleteResError;
      }
      
      // 3️⃣ Delete the user message itself
      const { error: deleteMsgError } = await supabase
        .from("user_messages")
        .delete()
        .eq("id", messageId)
        .eq("user_id", user.id);
        
      if (deleteMsgError) throw deleteMsgError;
      
      // 4️⃣ Update UI
      setMessages(
        messages.filter(
          (m) =>
            m.id !== messageId &&
            !(responses?.some((r) => r.id === m.id) ?? false)
        )
      );
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };
  
  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    useChatStore.setState({ user: null, messages: [] });
  };
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Chat AI</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-2 py-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {models?.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble
              content={msg.content}
              role={msg.role}
              timestamp={msg.createdAt}
              model={msg.role === "assistant" ? msg.model : undefined}
            />
            {/* ✅ Edit/Delete only for user's own message */}
            {msg.role === "user" && msg.userId === user?.id && (
              <div className="flex justify-end gap-3 mt-0 ml-12">
                <button
                  onClick={() => {
                    setEditingMessageId(msg.id);
                    setInput(msg.content);
                  }}
                  className="flex items-center gap-1 text-yellow-600 hover:underline"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={editingMessageId ? handleEditMessage : handleSendMessage}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {editingMessageId ? (
              <button className="bg-yellow-500 text-white px-4 rounded hover:bg-yellow-600 transition">
                Save
              </button>
            ) : (
              <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition">
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}