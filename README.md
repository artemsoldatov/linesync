# linesync

A realtime, offline-first collaborative odds board. Several people open the same board, move lines and build a shared betting slip together, with live presence cursors, optimistic edits, and clean conflict-free merging when someone was offline. It's built on Yjs CRDTs, so there's no "who wins" server logic to get wrong: concurrent edits just converge on their own.

Markets and selections live as nested Y.Maps, so an edit to one line never conflicts with an edit to another, and two edits to the same field still converge deterministically. Every change applies to the local Yjs doc immediately and syncs in the background afterward, so nothing waits on a round-trip to feel responsive.

The doc persists to IndexedDB through y-indexeddb, so edits made while offline are held locally and merged in once the connection comes back. Presence (who else is here, live cursors and avatars) comes from Yjs's awareness protocol.

There's no server-side document and no database behind the board. A stateless relay in server/relay.mjs, about 30 lines, just forwards protocol messages between peers, and the clients sync among themselves from there. React reads the whole thing through useSyncExternalStore.

## Running it

```bash
pnpm install
pnpm ws            # the stateless relay on :51234 (one terminal)
pnpm dev           # the app on :53100 (another terminal)
```

Open http://localhost:53100 in two tabs to see it sync.

## Stack

Next.js 16 with the App Router and Turbopack, React 19.2, TypeScript, Tailwind 4, Yjs with y-websocket and y-indexeddb, Vitest and Testing Library for unit tests, Playwright for multi-client e2e, plus a service worker and web manifest so it's installable and works offline.

## Tests

```bash
pnpm test          # unit: odds math + CRDT convergence + a component test
pnpm test:e2e      # two real browsers live-syncing, plus offline/reconnect merge
pnpm type-check && pnpm lint && pnpm build
```

The e2e suite opens two independent browser contexts against one room and checks that an edit in one shows up in the other, and that edits made while offline merge in correctly after reconnecting.

## A few implementation notes

Odds are stored as integer milli-units (decimal odds times 1000), so concurrent edits never fight over floating-point rounding. The starter board seeds with fixed ids, so if two fresh peers happen to seed at the same time they converge instead of ending up with duplicate markets. Adding something to the slip wraps in startViewTransition where the browser supports it and just degrades cleanly where it doesn't.

## Deploying

It's a static/edge Next build, deployed on Vercel. Point NEXT_PUBLIC_WS_URL at a deployed relay; server/relay.mjs runs anywhere Node runs, or you can swap in a hosted Yjs provider like Liveblocks without touching the client.
