import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { getRooms, getRoom } from '../src/api/rooms'
import { getMessages, postMessage } from '../src/api/messages'
import { register } from '../src/api/auth'
import { AuthProvider } from '../src/context/AuthContext'
import { RoomsPage } from '../src/pages/RoomsPage'
import { RoomPage } from '../src/pages/RoomPage'
import type { User } from '../src/types/index'

function renderWithProviders(ui: React.ReactElement, initialPath = '/rooms') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  )
}

function renderRoomPage(roomId: string) {
  return render(
    <MemoryRouter initialEntries={[`/rooms/${roomId}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/rooms/:id" element={<RoomPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('rooms API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('seeds at least 5 rooms on first call', () => {
    const rooms = getRooms()
    expect(rooms.length).toBeGreaterThanOrEqual(5)
  })

  it('returns the same rooms on subsequent calls', () => {
    const first = getRooms()
    const second = getRooms()
    expect(second).toHaveLength(first.length)
    expect(second[0].id).toBe(first[0].id)
  })

  it('getRoom returns null for unknown id', () => {
    getRooms()
    expect(getRoom('does-not-exist')).toBeNull()
  })

  it('getRoom returns the correct room', () => {
    const rooms = getRooms()
    const first = rooms[0]
    expect(getRoom(first.id)).toEqual(first)
  })

  it('getMessages returns empty array for room with no messages', () => {
    getRooms()
    expect(getMessages('room-1')).toEqual([])
  })

  it('postMessage saves to localStorage and returns new message', () => {
    getRooms()
    const author: User = {
      id: 'user-1',
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'x',
      createdAt: new Date().toISOString(),
    }
    const msg = postMessage('room-1', author, 'Hello world')
    expect(msg.text).toBe('Hello world')
    expect(msg.authorUsername).toBe('alice')
    expect(msg.roomId).toBe('room-1')
    expect(msg.id).toBeTruthy()

    const stored = getMessages('room-1')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(msg.id)
  })

  it('getMessages returns only messages for the specified room', () => {
    getRooms()
    const author: User = {
      id: 'user-1',
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'x',
      createdAt: new Date().toISOString(),
    }
    postMessage('room-1', author, 'msg in room 1')
    postMessage('room-2', author, 'msg in room 2')

    const room1Messages = getMessages('room-1')
    const room2Messages = getMessages('room-2')
    expect(room1Messages).toHaveLength(1)
    expect(room2Messages).toHaveLength(1)
    expect(room1Messages[0].text).toBe('msg in room 1')
    expect(room2Messages[0].text).toBe('msg in room 2')
  })

  it('messages persist across simulated page reload (localStorage round-trip)', () => {
    getRooms()
    const author: User = {
      id: 'user-1',
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'x',
      createdAt: new Date().toISOString(),
    }
    postMessage('room-1', author, 'persisted message')

    const reloaded = getMessages('room-1')
    expect(reloaded).toHaveLength(1)
    expect(reloaded[0].text).toBe('persisted message')
  })
})

describe('RoomsPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders a list of rooms with room names', () => {
    renderWithProviders(<RoomsPage />)
    const rooms = getRooms()
    for (const room of rooms) {
      expect(screen.getByText(room.name)).toBeInTheDocument()
    }
  })

  it('renders article titles for each room', () => {
    renderWithProviders(<RoomsPage />)
    const rooms = getRooms()
    for (const room of rooms) {
      expect(screen.getByText(room.articleTitle)).toBeInTheDocument()
    }
  })

  it('renders at least 5 room entries', () => {
    renderWithProviders(<RoomsPage />)
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(5)
  })
})

describe('RoomPage', () => {
  beforeEach(() => {
    localStorage.clear()
    register('alice', 'alice@example.com', 'secret')
  })

  it('renders room title', () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    expect(screen.getByText(rooms[0].name)).toBeInTheDocument()
  })

  it('renders article link that opens in new tab', () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    const link = screen.getByRole('link', { name: rooms[0].articleTitle })
    expect(link).toHaveAttribute('href', rooms[0].articleUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the message compose box', () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('send button is disabled when compose box is empty', () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('allows posting a message and shows it in the thread', async () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    const user = userEvent.setup()

    const textarea = screen.getByLabelText(/message/i)
    await user.type(textarea, 'Hello from test')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Hello from test')).toBeInTheDocument()
    })
  })

  it('clears the compose box after sending', async () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    const user = userEvent.setup()

    const textarea = screen.getByLabelText(/message/i)
    await user.type(textarea, 'A message')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(textarea).toHaveValue('')
    })
  })

  it('posted message persists in localStorage', async () => {
    const rooms = getRooms()
    renderRoomPage(rooms[0].id)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/message/i), 'Persisted message')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      const stored = getMessages(rooms[0].id)
      expect(stored.length).toBeGreaterThan(0)
      expect(stored[stored.length - 1].text).toBe('Persisted message')
    })
  })

  it('shows not found message for invalid room id', () => {
    renderRoomPage('not-a-real-room')
    expect(screen.getByText(/room not found/i)).toBeInTheDocument()
  })
})
