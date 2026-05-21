import { Link } from 'react-router-dom'
import type { ChatRoom } from '../types/index'
import './RoomCard.css'

interface RoomCardProps {
  room: ChatRoom
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link to={`/rooms/${room.id}`} className="room-card">
      <span className="room-card__name">{room.name}</span>
      <span className="room-card__article">{room.articleTitle}</span>
    </Link>
  )
}
