'use client'

import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  model?: string
}

export function MessageBubble({
  content,
  role,
  timestamp,
  model,
}: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-white'
        )}
      >
        <p className="text-sm">{content}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          {model && !isUser && (
            <span className="text-xs opacity-70">{model}</span>
          )}
          <span className="text-xs opacity-70">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  )
}