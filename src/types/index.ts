export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: string
}

export interface ChatRoom {
  id: string
  name: string
  articleTitle: string
  articleUrl: string
}

export interface Message {
  id: string
  roomId: string
  authorId: string
  authorUsername: string
  text: string
  createdAt: string
}

export interface DMThread {
  id: string
  participantA: string
  participantB: string
  lastMessageAt: string
}

export interface DMMessage {
  id: string
  threadId: string
  senderId: string
  text: string
  createdAt: string
  read: boolean
}
