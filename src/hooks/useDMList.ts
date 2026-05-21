import { useState } from 'react'
import type { DMConversation } from '../types/index'
import { getConversations } from '../api/dm'

interface UseDMListResult {
  conversations: DMConversation[]
  loading: boolean
}

export function useDMList(userId: string): UseDMListResult {
  const [conversations] = useState<DMConversation[]>(() =>
    getConversations(userId),
  )
  return { conversations, loading: false }
}
