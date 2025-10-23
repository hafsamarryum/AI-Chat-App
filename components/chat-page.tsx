'use client'

import type React from "react"
import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/lib/store'
import { MessageBubble } from './message-bubble'
import { trpc } from '@/lib/trpc-client'
import { Moon, Sun } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

export function ChatPage() {
  const { user, messages, addMessage, selectedModel, setSelectedModel, isLoading, setIsLoading } = useChatStore()
  const [input, setInput] = useState('')
  // const [darkMode, setDarkMode] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const { data: models } = trpc.models.getAvailable.useQuery()
  const sendMessageMutation = trpc.chat.send.useMutation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) {
      console.log("[v0] Cannot send message:", { input: input.trim(), isLoading, user })
      return
    }

    const userMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content: input,
      role: 'user' as const,
      model: selectedModel,
      createdAt: new Date(),
    }

    console.log("[v0] Sending user message:", userMessage)
    addMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      console.log("[v0] Calling tRPC chat.send")
      const response = await sendMessageMutation.mutateAsync({
        message: input,
        model: selectedModel,
        userId: user.id,
      })
      console.log("[v0] Received response:", response)
      // addMessage(response)
      addMessage({ 
        ...response,
    createdAt: new Date(response.createdAt), // ✅ convert string to Date
  })
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    useChatStore.setState({ user: null, messages: [] })
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat AI</h1>
          <div className="flex items-center gap-4">
            <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-1 rounded bg-white text-gray-900 text-sm"
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
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              role={msg.role}
              timestamp={msg.createdAt}
              model={msg.role === 'assistant' ? msg.model : undefined}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}