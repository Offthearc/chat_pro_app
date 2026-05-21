import type { Message, User } from '../types/index'

const MESSAGES_KEY_PREFIX = 'chat_pro_app:messages:'

function readMessages(roomId: string): Message[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY_PREFIX + roomId)
    return raw ? (JSON.parse(raw) as Message[]) : []
  } catch {
    return []
  }
}

function writeMessages(roomId: string, messages: Message[]): void {
  localStorage.setItem(MESSAGES_KEY_PREFIX + roomId, JSON.stringify(messages))
}

export function getMessages(roomId: string): Message[] {
  return readMessages(roomId)
}

export function postMessage(
  roomId: string,
  author: User,
  content: string,
): Message {
  const messages = readMessages(roomId)
  const newMessage: Message = {
    id: crypto.randomUUID(),
    roomId,
    authorId: author.id,
    authorUsername: author.username,
    text: content,
    createdAt: new Date().toISOString(),
  }
  writeMessages(roomId, [...messages, newMessage])
  return newMessage
}
