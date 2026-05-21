import type { ChatRoom, Message, User } from '../types/index'

const ROOMS_KEY = 'chat_pro_app:rooms'
const MESSAGES_KEY_PREFIX = 'chat_pro_app:messages:'

const SEED_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    name: 'GPT-4 Technical Report Discussion',
    articleTitle: 'GPT-4 Technical Report',
    articleUrl: 'https://openai.com/research/gpt-4',
  },
  {
    id: 'room-2',
    name: 'Attention Is All You Need — Paper Discussion',
    articleTitle: 'Attention Is All You Need',
    articleUrl: 'https://arxiv.org/abs/1706.03762',
  },
  {
    id: 'room-3',
    name: 'AlphaFold 3: Protein Structure Prediction',
    articleTitle:
      'AlphaFold 3: Accurate structure prediction of biomolecular interactions',
    articleUrl: 'https://deepmind.google/research/publications/alphafold-3/',
  },
  {
    id: 'room-4',
    name: 'LLaMA 3: Open Foundation Models',
    articleTitle: 'Introducing Meta Llama 3',
    articleUrl: 'https://ai.meta.com/blog/meta-llama-3/',
  },
  {
    id: 'room-5',
    name: "Claude's Model Specification — Discussion",
    articleTitle: "Claude's Model Specification",
    articleUrl: 'https://www.anthropic.com/news/claude-model-specification',
  },
]

function readRooms(): ChatRoom[] {
  try {
    const raw = localStorage.getItem(ROOMS_KEY)
    return raw ? (JSON.parse(raw) as ChatRoom[]) : []
  } catch {
    return []
  }
}

function writeRooms(rooms: ChatRoom[]): void {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
}

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

export function getRooms(): ChatRoom[] {
  const existing = readRooms()
  if (existing.length === 0) {
    writeRooms(SEED_ROOMS)
    return SEED_ROOMS
  }
  return existing
}

export function getRoom(id: string): ChatRoom | null {
  const rooms = getRooms()
  return rooms.find((r) => r.id === id) ?? null
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
