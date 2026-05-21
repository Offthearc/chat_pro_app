import { useState } from 'react'
import './MessageInput.css'

interface MessageInputProps {
  onSend: (content: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        className="message-input__textarea"
        aria-label="Message"
        placeholder="Type a message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent)
          }
        }}
        rows={2}
      />
      <button
        type="submit"
        className="message-input__send"
        disabled={value.trim().length === 0}
      >
        Send
      </button>
    </form>
  )
}
