import { useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useAuth } from '../context/AuthContext'
import { MessageList } from '../components/MessageList'
import { MessageInput } from '../components/MessageInput'
import './RoomPage.css'

export function RoomPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { room, messages, postMessage } = useRoom(id ?? '')

  if (!room) {
    return (
      <main className="room-page">
        <p className="room-page__not-found">Room not found.</p>
      </main>
    )
  }

  function handleSend(content: string) {
    if (!user) return
    postMessage(user, content)
  }

  return (
    <main className="room-page">
      <header className="room-page__header">
        <h1 className="room-page__title">{room.name}</h1>
        <a
          href={room.articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="room-page__article-link"
        >
          {room.articleTitle}
        </a>
      </header>
      <MessageList messages={messages} currentUserId={user?.id ?? ''} />
      <MessageInput onSend={handleSend} />
    </main>
  )
}
