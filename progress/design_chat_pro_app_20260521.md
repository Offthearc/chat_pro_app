# Design Progress — chat_pro_app — 2026-05-21

## Theme direction

A dark-mode-first system using deep-grey surfaces layered from `#1E1F22`
through `#313338`, with a blue-purple primary accent (`#5865F2`) — the same
hue family used by Discord/Slack but with cleaner spacing and a single
type family (Inter). The goal is a focused, professional reading environment
suited to extended chat sessions anchored around AI articles.

## Token summary

### Palette (14 named colors)

- `primary` / `primary-hover` — `#5865F2` / `#4752C4` (buttons, sent bubbles, unread dots)
- `surface` — `#1E1F22` (page background)
- `surface-variant` — `#2B2D31` (sidebars, panels)
- `surface-elevated` — `#313338` (cards, message area, inputs)
- `on-surface` / `on-surface-variant` — `#DCDDDE` / `#96989D`
- `border` — `#3F4147`
- `chat-sent` / `on-chat-sent` — `#5865F2` / `#FFFFFF`
- `chat-received` / `on-chat-received` — `#313338` / `#DCDDDE`
- `badge` / `on-badge` — `#ED4245` / `#FFFFFF` (unread count)
- `danger` / `danger-hover` — `#ED4245` / `#C03537`
- `success` — `#57F287`
- `link` — `#00AFF4`

### Type scale

- `sans` — Inter 15 px / 400 / 1.5 (UI body)
- `heading` — Inter 20 px / 700 / 1.25 (section titles, room names)
- `mono` — system monospace 13 px / 400 / 1.6 (code blocks)

### Spacing

`xs` 4 px · `sm` 8 px · `md` 16 px · `lg` 24 px · `xl` 40 px

### Radii

`sm` 4 px · `md` 8 px · `lg` 12 px · `full` 9999 px

### Components with token entries

`button-primary`, `button-danger`, `card`, `input`, `navbar`, `room-card`,
`message-bubble-sent`, `message-bubble-received`, `message-input`,
`dm-thread-item`, `unread-badge`, `user-selector`, `auth-form`

## Verification

- `node scripts/design_check.mjs --write` → OK (tokens.css written)
- `node scripts/design_check.mjs` → OK (in sync, no off-palette hex or
  off-token fonts)

## Assumptions and open questions

- Auth form is styled as a centred card on the bare `surface` background,
  matching a typical login-page pattern. If a split-screen or illustration
  layout is later desired, a new `surface-overlay` token should be added.
- No light-mode tokens are defined for MVP. A light-mode variant can be added
  by introducing a second CSS custom-property block under a
  `[data-theme="light"]` selector in a future designer pass.
- `link` cyan (`#00AFF4`) is used only for article URLs in room/message views.
  If the implementer needs further link-state variants (visited, active),
  additional tokens should be added to the front matter rather than hardcoded.
