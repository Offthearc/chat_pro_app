import type { User, DMConversation, DMMessageNew } from '../types/index'

const CONVERSATIONS_KEY = 'chat_pro_app:dm:conversations'
const MESSAGES_KEY_PREFIX = 'chat_pro_app:dm:messages:'

function readConversations(): DMConversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY)
    return raw ? (JSON.parse(raw) as DMConversation[]) : []
  } catch {
    return []
  }
}

function writeConversations(conversations: DMConversation[]): void {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
}

function readMessages(conversationId: string): DMMessageNew[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY_PREFIX + conversationId)
    return raw ? (JSON.parse(raw) as DMMessageNew[]) : []
  } catch {
    return []
  }
}

function writeMessages(conversationId: string, messages: DMMessageNew[]): void {
  localStorage.setItem(
    MESSAGES_KEY_PREFIX + conversationId,
    JSON.stringify(messages),
  )
}

function makeConversationId(id1: string, id2: string): string {
  return [id1, id2].sort().join(':')
}

export function getConversations(userId: string): DMConversation[] {
  return readConversations().filter((c) => c.participantIds.includes(userId))
}

export function getOrCreateConversation(
  user1: User,
  user2: User,
): DMConversation {
  const id = makeConversationId(user1.id, user2.id)
  const conversations = readConversations()
  const existing = conversations.find((c) => c.id === id)
  if (existing) return existing

  const sorted = [user1, user2].sort((a, b) => a.id.localeCompare(b.id))
  const newConv: DMConversation = {
    id,
    participantIds: [sorted[0].id, sorted[1].id],
    participantUsernames: [sorted[0].username, sorted[1].username],
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  }
  writeConversations([...conversations, newConv])
  return newConv
}

export function getDMMessages(conversationId: string): DMMessageNew[] {
  return readMessages(conversationId)
}

export function sendDMMessage(
  conversationId: string,
  sender: User,
  content: string,
): DMMessageNew {
  const messages = readMessages(conversationId)
  const newMessage: DMMessageNew = {
    id: crypto.randomUUID(),
    conversationId,
    senderId: sender.id,
    senderUsername: sender.username,
    content,
    createdAt: new Date().toISOString(),
  }
  writeMessages(conversationId, [...messages, newMessage])

  const conversations = readConversations()
  const updated = conversations.map((c) =>
    c.id === conversationId
      ? {
          ...c,
          lastMessageAt: newMessage.createdAt,
          unreadCount: c.unreadCount + 1,
        }
      : c,
  )
  writeConversations(updated)

  return newMessage
}

export function markRead(conversationId: string, userId: string): void {
  const conversations = readConversations()
  const updated = conversations.map((c) => {
    if (c.id === conversationId && c.participantIds.includes(userId)) {
      return { ...c, unreadCount: 0 }
    }
    return c
  })
  writeConversations(updated)
}
