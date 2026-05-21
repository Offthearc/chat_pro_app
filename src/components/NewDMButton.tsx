import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types/index'
import { getAllUsers } from '../api/auth'
import { getOrCreateConversation } from '../api/dm'
import './NewDMButton.css'

interface NewDMButtonProps {
  currentUser: User
}

export function NewDMButton({ currentUser }: NewDMButtonProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const otherUsers = getAllUsers().filter((u) => u.id !== currentUser.id)

  function handleSelect(otherUser: User) {
    const conv = getOrCreateConversation(currentUser, otherUser)
    setOpen(false)
    navigate(`/dm/${conv.id}`)
  }

  return (
    <div className="new-dm-button">
      <button
        className="new-dm-button__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        New Message
      </button>
      {open && (
        <div
          className="new-dm-button__picker"
          role="listbox"
          aria-label="Select user"
        >
          {otherUsers.length === 0 ? (
            <p className="new-dm-button__empty">No other users registered.</p>
          ) : (
            otherUsers.map((u) => (
              <button
                key={u.id}
                className="new-dm-button__user-option"
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(u)}
              >
                {u.username}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
