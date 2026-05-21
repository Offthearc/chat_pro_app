import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDMThread } from '../hooks/useDMThread'
import { markRead, getConversations } from '../api/dm'
import { MessageInput } from '../components/MessageInput'
import './DMThreadPage.css'

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleString()
}

export function DMThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { messages, send } = useDMThread(conversationId ?? '')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!conversationId || !user) return
    const convs = getConversations(user.id)
    const conv = convs.find((c) => c.id === conversationId)
    if (!conv) {
      navigate('/dm', { replace: true })
    } else {
      markRead(conversationId, user.id)
    }
  }, [conversationId, user, navigate])

  useEffect(() => {
    if (
      bottomRef.current &&
      typeof bottomRef.current.scrollIntoView === 'function'
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const convs = user ? getConversations(user.id) : []
  const conv = convs.find((c) => c.id === conversationId)
  const otherUsername = conv
    ? conv.participantIds[0] === user?.id
      ? conv.participantUsernames[1]
      : conv.participantUsernames[0]
    : ''

  function handleSend(content: string) {
    if (!user) return
    send(user, content)
  }

  return (
    <main className="dm-thread-page">
      <header className="dm-thread-page__header">
        <h1 className="dm-thread-page__title">
          {otherUsername ? `@${otherUsername}` : 'Direct Message'}
        </h1>
      </header>
      <div className="dm-thread-page__messages" role="log" aria-label="Thread">
        {messages.map((msg) => {
          const isMine = msg.senderId === user?.id
          return (
            <div
              key={msg.id}
              className={`dm-message ${isMine ? 'dm-message--sent' : 'dm-message--received'}`}
            >
              <span className="dm-message__author">{msg.senderUsername}</span>
              <span className="dm-message__bubble">{msg.content}</span>
              <span className="dm-message__time">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </main>
  )
}
