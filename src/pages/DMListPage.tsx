import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDMList } from '../hooks/useDMList'
import { NewDMButton } from '../components/NewDMButton'
import './DMListPage.css'

export function DMListPage() {
  const { user } = useAuth()
  const { conversations } = useDMList(user?.id ?? '')

  return (
    <main className="dm-list-page">
      <div className="dm-list-page__header">
        <h1 className="dm-list-page__title">Direct Messages</h1>
        {user && <NewDMButton currentUser={user} />}
      </div>
      {conversations.length === 0 ? (
        <p className="dm-list-page__empty">No conversations yet.</p>
      ) : (
        <ul className="dm-list-page__list" role="list">
          {conversations.map((conv) => {
            const otherUsername =
              conv.participantIds[0] === user?.id
                ? conv.participantUsernames[1]
                : conv.participantUsernames[0]
            return (
              <li key={conv.id}>
                <Link
                  to={`/dm/${conv.id}`}
                  className="dm-thread-item"
                  aria-label={`Conversation with ${otherUsername}`}
                >
                  <span className="dm-thread-item__username">
                    {otherUsername}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span
                      className="dm-thread-item__badge"
                      aria-label={`${conv.unreadCount} unread`}
                    >
                      {conv.unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
