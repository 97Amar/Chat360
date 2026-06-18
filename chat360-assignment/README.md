# Chat360 — Streaming Chat Widget

A production-quality real-time streaming chat UI built for the Chat360 senior frontend take-home assignment.

---

## How to Run

You need **two terminals** — one for the mock backend, one for the frontend.

### 1. Start the Mock SSE Backend

```bash
cd backend
npm install        # installs express & cors (only needed once)
npm run start      # → http://localhost:4000
```

### 2. Start the Frontend Dev Server

```bash
cd chat360-assignment
npm install        # only needed once
npm run dev        # → http://localhost:3000
```

Open **http://localhost:3000** in your browser. The frontend connects directly to `http://localhost:4000`.

> **Note:** Both servers must be running at the same time.

---

## Tradeoffs & Shortcuts

### SSE via `fetch` + `ReadableStream` instead of `EventSource`
`EventSource` only supports GET requests. The mock server exposes a POST endpoint, so the SSE byte stream is parsed manually using `fetch` + `ReadableStream`. This also gives a built-in `AbortController` for cancellation — something `EventSource` doesn't support natively.

### Plain React state — no external state library
All streaming state lives in a single `useChat` hook (`useState` + `useCallback`). There is no cross-component shared state, no server caching, and no optimistic updates — reaching for Zustand or React Query here would have been accidental complexity with no real benefit for a self-contained widget.

### Functional `setState` for token appends
Token streaming uses `prev => prev.map(...)` to update message content. This is safe under React 18 concurrent mode and avoids any stale closure issues without needing `useRef` for the message list.

### No automated tests
The two highest-value test targets were identified but not implemented due to time:
1. `streamChat` service — mock a `ReadableStream` and assert `onToken` / `onDone` / `onError` callbacks fire in the correct order.
2. Auto-scroll logic in `ChatWindow` — assert scroll pauses when the user scrolls up and resumes on jump-to-bottom.

### In-memory persistence only
Chat history is stored in React state and clears on page refresh. No `localStorage` or backend persistence.

---

## What I'd Do Differently With More Time

- **Markdown rendering** — Add `react-markdown` + `remark-gfm` to render code blocks, lists, and bold/italic in assistant responses.
- **Automated tests** — Unit test the SSE service with a mocked `ReadableStream` and `@testing-library/react` for the hook and components.
- **Keyboard accessibility** — Add a keyboard shortcut (e.g. `R`) to trigger the retry action on a focused error bubble.
- **Message persistence** — Persist chat history to `localStorage` so conversations survive a page refresh.
- **Dark mode** — The design system (`_var.scss`) is already fully tokenized; adding a dark theme would only require a `prefers-color-scheme` media query override on the CSS variables.
- **Abort on clear** — Call `AbortController.abort()` on the active stream when the user clears the chat mid-stream, rather than letting the stream finish in the background.
- **Rate-limiting / backpressure UI** — Show a subtle indicator when the server is slow to send the first token (i.e. time-to-first-token latency).
