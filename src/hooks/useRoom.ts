import { useState, useCallback } from 'react'
import type { ChatRoom, Message, User } from '../types/index'
import {
  getRoom,
  getMessages,
  postMessage as apiPostMessage,
} from '../api/rooms'

interface UseRoomResult {
  room: ChatRoom | null
  messages: Message[]
  postMessage: (author: User, content: string) => void
}

export function useRoom(roomId: string): UseRoomResult {
  const [room] = useState<ChatRoom | null>(() => getRoom(roomId))
  const [messages, setMessages] = useState<Message[]>(() => getMessages(roomId))

  const postMessage = useCallback(
    (author: User, content: string) => {
      const msg = apiPostMessage(roomId, author, content)
      setMessages((prev) => [...prev, msg])
    },
    [roomId],
  )

  return { room, messages, postMessage }
}
