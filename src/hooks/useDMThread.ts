import { useState, useCallback } from 'react'
import type { DMMessageNew, User } from '../types/index'
import { getDMMessages, sendDMMessage as apiSendDMMessage } from '../api/dm'

interface UseDMThreadResult {
  messages: DMMessageNew[]
  send: (sender: User, content: string) => void
  loading: boolean
}

export function useDMThread(conversationId: string): UseDMThreadResult {
  const [messages, setMessages] = useState<DMMessageNew[]>(() =>
    getDMMessages(conversationId),
  )

  const send = useCallback(
    (sender: User, content: string) => {
      const msg = apiSendDMMessage(conversationId, sender, content)
      setMessages((prev) => [...prev, msg])
    },
    [conversationId],
  )

  return { messages, send, loading: false }
}
