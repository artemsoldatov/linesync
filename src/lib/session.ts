import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { addSelection, createMarket, readBoard } from './board';

const ROOM = 'linesync';
// 127.0.0.1, not localhost: localhost can resolve to ::1 first, and the dev
// server binds IPv4 — the mismatch silently fails the socket
const WS_URL = 'ws://127.0.0.1:51234';

export interface Session {
  doc: Y.Doc;
  provider: WebsocketProvider;
  persistence: IndexeddbPersistence;
}

let session: Session | null = null;

// Fixed seed content: deterministic ids mean two peers seeding at once converge
// instead of duplicating markets.
function seedIfEmpty(doc: Y.Doc): void {
  if (readBoard(doc).markets.length > 0) return;
  createMarket(doc, 'm1', 'Match Winner', 0);
  addSelection(doc, 'm1', 's1', 'Home', 2100);
  addSelection(doc, 'm1', 's2', 'Draw', 3400);
  addSelection(doc, 'm1', 's3', 'Away', 3600);
  createMarket(doc, 'm2', 'Total Goals', 1);
  addSelection(doc, 'm2', 's4', 'Over 2.5', 1850);
  addSelection(doc, 'm2', 's5', 'Under 2.5', 1950);
}

export function getSession(): Session {
  if (session) return session;

  const doc = new Y.Doc();
  const persistence = new IndexeddbPersistence(ROOM, doc);
  const provider = new WebsocketProvider(WS_URL, ROOM, doc);

  // seed only once we know the real state: after the server syncs (online) or
  // after local persistence loads with no server (offline first run)
  provider.once('sync', () => seedIfEmpty(doc));
  persistence.once('synced', () => {
    setTimeout(() => seedIfEmpty(doc), 1500);
  });

  session = { doc, provider, persistence };
  return session;
}
