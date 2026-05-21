import { useState } from 'react'
import type { ChatRoom } from '../types/index'
import { getRooms } from '../api/rooms'

interface UseRoomsResult {
  rooms: ChatRoom[]
  loading: boolean
}

export function useRooms(): UseRoomsResult {
  const [rooms] = useState<ChatRoom[]>(() => getRooms())
  return { rooms, loading: false }
}
