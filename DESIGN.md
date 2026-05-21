---
version: 1
name: ChatPro Dark
description: >-
  Dark-mode-first design system for a focused, professional real-time chat
  platform. Blue-purple accent on deep-grey surfaces, optimised for legibility
  in long reading sessions and clear message attribution.
colors:
  primary: '#5865F2'
  on-primary: '#FFFFFF'
  primary-hover: '#4752C4'
  surface: '#1E1F22'
  on-surface: '#DCDDDE'
  surface-variant: '#2B2D31'
  on-surface-variant: '#96989D'
  surface-elevated: '#313338'
  border: '#3F4147'
  danger: '#ED4245'
  danger-hover: '#C03537'
  success: '#57F287'
  unread: '#5865F2'
  chat-sent: '#5865F2'
  on-chat-sent: '#FFFFFF'
  chat-received: '#313338'
  on-chat-received: '#DCDDDE'
  badge: '#ED4245'
  on-badge: '#FFFFFF'
  link: '#00AFF4'
typography:
  sans:
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  heading:
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.25'
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    hoverBackgroundColor: '{colors.primary-hover}'
    rounded: '{rounded.sm}'
    padding: '{spacing.sm} {spacing.md}'
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.on-primary}'
    hoverBackgroundColor: '{colors.danger-hover}'
    rounded: '{rounded.sm}'
    padding: '{spacing.sm} {spacing.md}'
  card:
    backgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    borderColor: '{colors.border}'
    placeholderColor: '{colors.on-surface-variant}'
    rounded: '{rounded.sm}'
    padding: '{spacing.sm} {spacing.md}'
  navbar:
    backgroundColor: '{colors.surface-variant}'
    textColor: '{colors.on-surface}'
    borderColor: '{colors.border}'
  room-card:
    backgroundColor: '{colors.surface-variant}'
    hoverBackgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.md}'
    padding: '{spacing.md}'
  message-bubble-sent:
    backgroundColor: '{colors.chat-sent}'
    textColor: '{colors.on-chat-sent}'
    rounded: '{rounded.lg}'
    padding: '{spacing.sm} {spacing.md}'
  message-bubble-received:
    backgroundColor: '{colors.chat-received}'
    textColor: '{colors.on-chat-received}'
    rounded: '{rounded.lg}'
    padding: '{spacing.sm} {spacing.md}'
  message-input:
    backgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.on-surface}'
    borderColor: '{colors.border}'
    rounded: '{rounded.md}'
    padding: '{spacing.sm} {spacing.md}'
  dm-thread-item:
    backgroundColor: '{colors.surface-variant}'
    hoverBackgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.md}'
    padding: '{spacing.sm} {spacing.md}'
  unread-badge:
    backgroundColor: '{colors.badge}'
    textColor: '{colors.on-badge}'
    rounded: '{rounded.full}'
  user-selector:
    backgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.on-surface}'
    borderColor: '{colors.border}'
    rounded: '{rounded.sm}'
    padding: '{spacing.sm} {spacing.md}'
  auth-form:
    backgroundColor: '{colors.surface-variant}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.lg}'
    padding: '{spacing.xl}'
---

# Design — ChatPro Dark

> This is the **single source of truth** for the visual design system. The YAML
> front matter above defines machine-readable tokens; the sections below explain
> the rationale. `scripts/design_check.mjs --write` generates
> `src/theme/tokens.css` from the tokens, and `scripts/design_check.mjs` (run by
> `init.sh`) fails if the app drifts from this file.

## Overview

ChatPro is a focused, professional chat platform for discussing AI articles. The
visual identity follows the Discord/Slack tradition — dark surfaces reduce eye
strain during extended reading, while a blue-purple (`#5865F2`) accent provides
clear interactive signposting. The overall feel is calm and information-dense
rather than playful or marketing-heavy. Typography is small and efficient; every
pixel of vertical space counts in a message-thread layout.

## Colors

The palette has four distinct layers of surface depth, allowing the UI to
communicate hierarchy through tone rather than heavy outlines:

- `surface` (`#1E1F22`) — the deepest layer, used as the page background.
- `surface-variant` (`#2B2D31`) — sidebars, panels, and secondary containers.
- `surface-elevated` (`#313338`) — cards, message-list backgrounds, and inputs
  on top of panels.
- `border` (`#3F4147`) — subtle dividers and input outlines. Low contrast
  against the surface family keeps them from cluttering dense UIs.

`primary` (`#5865F2`) is the sole interactive accent. It drives buttons,
unread indicators, and sent message bubbles. Its hover state (`primary-hover`)
is a darker shade of the same hue.

Chat bubbles are intentionally asymmetric: sent messages use `chat-sent`
(same as `primary`) to create a strong visual ownership signal; received
messages use `chat-received` (a neutral elevated surface) so the sender's words
are easy to scan.

`danger` is red, `success` is bright green — both reserved strictly for state
feedback (errors, confirmations), never for decoration.

`link` is a distinct cyan so inline article links stand out from primary
interactive elements.

## Typography

A single family — Inter — covers all UI text. Using one family with variable
weight maintains a calm, uniform feel while keeping the bundle small (system
fallbacks cover all platforms). Heading weight bumps to 700 to create clear
hierarchy between room names, section titles, and body copy.

`mono` is reserved exclusively for code blocks in messages. Keeping the size
at 13 px (slightly smaller than body) visually distinguishes code from prose
without disrupting line flow.

## Layout

Spacing uses a five-step scale (`xs` through `xl`). This project lives inside
a two-column shell (sidebar + main panel), so `md` (16 px) is the standard
internal padding for panels and `lg` (24 px) is used for card interiors and
auth forms where more breathing room aids legibility.

The message-list column is inherently narrow on desktop, so message bubble
padding is `sm + md` (vertical + horizontal) to keep threads tight and easy to
scan.

## Elevation & Depth

Depth is conveyed purely through the four surface tones — no drop shadows are
needed. The hierarchy is: `surface` (behind everything) < `surface-variant`
(sidebar, panels) < `surface-elevated` (interactive cards, message areas) <
modals (which float on a semi-transparent `surface` overlay). This avoids the
visual noise of layered shadows in an already dark environment.

## Shapes

The `rounded` scale is small and purposeful:

- `sm` (4 px) — inputs, dropdowns, and small interactive targets. Close to
  square keeps the UI grounded.
- `md` (8 px) — room cards, DM thread items, and message input boxes.
- `lg` (12 px) — chat bubbles and auth form containers. Slightly softer to
  differentiate content surfaces from control surfaces.
- `full` (9999 px) — unread-count badges and avatar circles.

## Components

**button-primary** — Solid `primary` background, `on-primary` text, `sm`
radius. Used for all primary calls to action (Send, Register, Login). Hover
darkens to `primary-hover`.

**button-danger** — Solid `danger` background for destructive or alert actions
(e.g., a future delete flow). Same radius as `button-primary`.

**card** — `surface-elevated` background, `lg` radius, `lg` padding. Wraps
grouped content sections.

**input** — `surface` background (recessed against `surface-variant` panels),
`border` outline, `sm` radius. Placeholder text uses `on-surface-variant` so
it reads clearly without competing with entered text.

**navbar** — `surface-variant` background, spans the top of the page. Contains
the app name, current username, and logout control.

**room-card** — `surface-variant` background with `surface-elevated` hover.
`md` radius, `md` padding. Shows room name and article title.

**message-bubble-sent** — `chat-sent` (`primary`) background, `on-chat-sent`
white text. `lg` radius, right-aligned.

**message-bubble-received** — `chat-received` (`surface-elevated`) background,
`on-chat-received` body text. `lg` radius, left-aligned.

**message-input** — Sits at the bottom of the room/DM view. `surface-elevated`
background, `md` radius. Visually separated from the message list above.

**dm-thread-item** — Similar to `room-card`. Holds the correspondent's
username and a preview of the last message. Gains the `unread-badge` overlay
when there are unread messages.

**unread-badge** — `badge` (red) background, `on-badge` white text, `full`
radius. Positioned top-right on `dm-thread-item` entries. Also drives the DM
nav indicator.

**user-selector** — A styled `<select>` or combobox for picking a user to
start a DM with. `surface-elevated` background, `border` outline, `sm` radius.

**auth-form** — The container for RegisterPage and LoginPage. `surface-variant`
background, `lg` radius, `xl` padding. Centres itself on the `surface`
background to create a card-on-background login experience.

## Do's and Don'ts

- Reference design tokens via CSS custom properties: `var(--color-primary)`,
  `var(--space-md)`, `var(--rounded-lg)`.
- Add new tokens to the YAML front matter when the design genuinely needs a new
  value; never invent one-off values in component stylesheets.
- Keep the palette small and intentional — prefer mapping a new use case to an
  existing token over adding a new color.
- Use `var(--font-mono)` for code blocks; never set a `font-family` literal
  in component CSS.
- Use the `surface` hierarchy (surface < surface-variant < surface-elevated)
  to express depth; do not add box-shadows as a substitute.
- Do not hardcode hex colors in any component file (`color: #5865F2`). Use the
  token variable instead.
- Do not hand-edit `src/theme/tokens.css` — it is generated by
  `scripts/design_check.mjs --write`.
- Do not introduce off-scale spacing (e.g., `padding: 11px`). Snap to the
  nearest spacing token.
- Reserve `danger` and `success` strictly for system state feedback; do not
  repurpose them as decorative colors.
