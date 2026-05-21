import { useEffect, useRef } from 'react'
import type { Message } from '../types/index'
import './MessageList.css'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleString()
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      bottomRef.current &&
      typeof bottomRef.current.scrollIntoView === 'function'
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="message-list" role="log" aria-label="Thread">
      {messages.map((msg) => {
        const isMine = msg.authorId === currentUserId
        return (
          <div
            key={msg.id}
            className={`message-list__item ${isMine ? 'message-list__item--sent' : 'message-list__item--received'}`}
          >
            <span className="message-list__author">{msg.authorUsername}</span>
            <span className="message-list__bubble">{msg.text}</span>
            <span className="message-list__time">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
