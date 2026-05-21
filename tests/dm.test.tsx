import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  getConversations,
  getOrCreateConversation,
  getDMMessages,
  sendDMMessage,
  markRead,
} from '../src/api/dm'
import { register, login } from '../src/api/auth'
import { AuthProvider } from '../src/context/AuthContext'
import { DMListPage } from '../src/pages/DMListPage'
import { DMThreadPage } from '../src/pages/DMThreadPage'
import type { User } from '../src/types/index'

const alice: User = {
  id: 'user-alice',
  username: 'alice',
  email: 'alice@example.com',
  passwordHash: 'x',
  createdAt: new Date().toISOString(),
}

const bob: User = {
  id: 'user-bob',
  username: 'bob',
  email: 'bob@example.com',
  passwordHash: 'x',
  createdAt: new Date().toISOString(),
}

function renderDMListPage() {
  return render(
    <MemoryRouter initialEntries={['/dm']}>
      <AuthProvider>
        <Routes>
          <Route path="/dm" element={<DMListPage />} />
          <Route path="/dm/:conversationId" element={<DMThreadPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

function renderDMThreadPage(conversationId: string) {
  return render(
    <MemoryRouter initialEntries={[`/dm/${conversationId}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/dm" element={<DMListPage />} />
          <Route path="/dm/:conversationId" element={<DMThreadPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('DM API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getOrCreateConversation returns the same conversation when called twice', () => {
    const conv1 = getOrCreateConversation(alice, bob)
    const conv2 = getOrCreateConversation(alice, bob)
    expect(conv1.id).toBe(conv2.id)
    expect(getConversations(alice.id)).toHaveLength(1)
  })

  it('getOrCreateConversation is commutative — same id regardless of arg order', () => {
    const conv1 = getOrCreateConversation(alice, bob)
    const conv2 = getOrCreateConversation(bob, alice)
    expect(conv1.id).toBe(conv2.id)
  })

  it('sendDMMessage saves to localStorage and returns the new message', () => {
    const conv = getOrCreateConversation(alice, bob)
    const msg = sendDMMessage(conv.id, alice, 'Hello Bob')
    expect(msg.content).toBe('Hello Bob')
    expect(msg.senderId).toBe(alice.id)
    expect(msg.senderUsername).toBe('alice')
    expect(msg.conversationId).toBe(conv.id)
    expect(msg.id).toBeTruthy()

    const stored = getDMMessages(conv.id)
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(msg.id)
  })

  it('getDMMessages returns messages for a conversation', () => {
    const conv = getOrCreateConversation(alice, bob)
    sendDMMessage(conv.id, alice, 'First')
    sendDMMessage(conv.id, bob, 'Second')

    const messages = getDMMessages(conv.id)
    expect(messages).toHaveLength(2)
    expect(messages[0].content).toBe('First')
    expect(messages[1].content).toBe('Second')
  })

  it('getDMMessages returns only messages for the specified conversation', () => {
    const charlie: User = {
      id: 'user-charlie',
      username: 'charlie',
      email: 'charlie@example.com',
      passwordHash: 'x',
      createdAt: new Date().toISOString(),
    }
    const conv1 = getOrCreateConversation(alice, bob)
    const conv2 = getOrCreateConversation(alice, charlie)
    sendDMMessage(conv1.id, alice, 'to bob')
    sendDMMessage(conv2.id, alice, 'to charlie')

    expect(getDMMessages(conv1.id)).toHaveLength(1)
    expect(getDMMessages(conv2.id)).toHaveLength(1)
    expect(getDMMessages(conv1.id)[0].content).toBe('to bob')
    expect(getDMMessages(conv2.id)[0].content).toBe('to charlie')
  })

  it('markRead sets unreadCount to 0', () => {
    const conv = getOrCreateConversation(alice, bob)
    sendDMMessage(conv.id, bob, 'Hey Alice')
    sendDMMessage(conv.id, bob, 'How are you?')

    const before = getConversations(alice.id)
    expect(before[0].unreadCount).toBeGreaterThan(0)

    markRead(conv.id, alice.id)

    const after = getConversations(alice.id)
    expect(after[0].unreadCount).toBe(0)
  })

  it('getConversations returns only conversations for the specified user', () => {
    const charlie: User = {
      id: 'user-charlie',
      username: 'charlie',
      email: 'charlie@example.com',
      passwordHash: 'x',
      createdAt: new Date().toISOString(),
    }
    getOrCreateConversation(alice, bob)
    getOrCreateConversation(bob, charlie)

    const aliceConvs = getConversations(alice.id)
    const bobConvs = getConversations(bob.id)
    const charlieConvs = getConversations(charlie.id)

    expect(aliceConvs).toHaveLength(1)
    expect(bobConvs).toHaveLength(2)
    expect(charlieConvs).toHaveLength(1)
  })

  it('DM messages persist across simulated page reload', () => {
    const conv = getOrCreateConversation(alice, bob)
    sendDMMessage(conv.id, alice, 'persisted')

    const reloaded = getDMMessages(conv.id)
    expect(reloaded).toHaveLength(1)
    expect(reloaded[0].content).toBe('persisted')
  })
})

describe('DMListPage', () => {
  let registeredAlice: User
  let registeredBob: User

  beforeEach(() => {
    localStorage.clear()
    registeredAlice = register('alice', 'alice@example.com', 'secret')
    registeredBob = register('bob', 'bob@example.com', 'bobpass')
    login('alice@example.com', 'secret')
  })

  it('renders empty state when no conversations', () => {
    renderDMListPage()
    expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument()
  })

  it('renders conversations for the current user', () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    sendDMMessage(conv.id, registeredBob, 'Hello alice')

    renderDMListPage()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('renders unread badge for conversations with unread messages', () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    sendDMMessage(conv.id, registeredBob, 'unread message')

    renderDMListPage()
    expect(screen.getByLabelText(/unread/i)).toBeInTheDocument()
  })

  it('renders New Message button', () => {
    renderDMListPage()
    expect(
      screen.getByRole('button', { name: /new message/i }),
    ).toBeInTheDocument()
  })
})

describe('DMThreadPage', () => {
  let registeredAlice: User
  let registeredBob: User

  beforeEach(() => {
    localStorage.clear()
    registeredAlice = register('alice', 'alice@example.com', 'secret')
    registeredBob = register('bob', 'bob@example.com', 'bobpass')
    login('alice@example.com', 'secret')
  })

  it('renders messages in the thread', () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    sendDMMessage(conv.id, registeredBob, 'Hello from bob')

    renderDMThreadPage(conv.id)
    expect(screen.getByText('Hello from bob')).toBeInTheDocument()
  })

  it('renders the compose box', () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    renderDMThreadPage(conv.id)
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('send button is disabled when compose box is empty', () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    renderDMThreadPage(conv.id)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('allows sending a message and shows it in the thread', async () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    renderDMThreadPage(conv.id)
    const user = userEvent.setup()

    const textarea = screen.getByLabelText(/message/i)
    await user.type(textarea, 'Hello from alice')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Hello from alice')).toBeInTheDocument()
    })
  })

  it('clears compose box after sending', async () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    renderDMThreadPage(conv.id)
    const user = userEvent.setup()

    const textarea = screen.getByLabelText(/message/i)
    await user.type(textarea, 'Test message')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(textarea).toHaveValue('')
    })
  })

  it('sent message persists in localStorage', async () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    renderDMThreadPage(conv.id)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/message/i), 'Persisted DM')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      const stored = getDMMessages(conv.id)
      expect(stored.length).toBeGreaterThan(0)
      const last = stored[stored.length - 1]
      expect(last.content).toBe('Persisted DM')
    })
  })

  it('sent messages are aligned right (have sent class)', async () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    renderDMThreadPage(conv.id)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/message/i), 'My message')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      const bubble = screen.getByText('My message')
      expect(bubble.closest('.dm-message--sent')).not.toBeNull()
    })
  })

  it('received messages are aligned left (have received class)', () => {
    const conv = getOrCreateConversation(registeredAlice, registeredBob)
    sendDMMessage(conv.id, registeredBob, 'From bob')

    renderDMThreadPage(conv.id)
    const bubble = screen.getByText('From bob')
    expect(bubble.closest('.dm-message--received')).not.toBeNull()
  })
})
