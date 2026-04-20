import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';
import {
  addSelection,
  createMarket,
  readBoard,
  setOdds,
  setSuspended,
  toggleSlip,
} from './board';

// syncs updates both ways, the way a Yjs provider would over the wire
function sync(a: Y.Doc, b: Y.Doc): void {
  Y.applyUpdate(b, Y.encodeStateAsUpdate(a, Y.encodeStateVector(b)));
  Y.applyUpdate(a, Y.encodeStateAsUpdate(b, Y.encodeStateVector(a)));
}

function seed(doc: Y.Doc): void {
  createMarket(doc, 'm1', 'Match Winner', 0);
  addSelection(doc, 'm1', 's1', 'Home', 2000);
  addSelection(doc, 'm1', 's2', 'Away', 3500);
}

describe('board CRDT', () => {
  it('reads back what was written', () => {
    const doc = new Y.Doc();
    seed(doc);
    const board = readBoard(doc);
    expect(board.markets).toHaveLength(1);
    expect(board.markets[0].selections.map((s) => s.label)).toEqual(['Home', 'Away']);
    expect(board.markets[0].selections[0].oddsMilli).toBe(2000);
  });

  it('converges when two peers edit different selections concurrently', () => {
    const a = new Y.Doc();
    seed(a);
    const b = new Y.Doc();
    sync(a, b); // b now has the seeded board

    // concurrent, non-overlapping edits — no conflict
    setOdds(a, 'm1', 's1', 2500);
    setSuspended(b, 'm1', 's2', true);
    sync(a, b);

    for (const doc of [a, b]) {
      const board = readBoard(doc);
      const [home, away] = board.markets[0].selections;
      expect(home.oddsMilli).toBe(2500);
      expect(away.suspended).toBe(true);
    }
  });

  it('converges on a conflicting edit to the same field (last write wins, deterministically)', () => {
    const a = new Y.Doc();
    seed(a);
    const b = new Y.Doc();
    sync(a, b);

    setOdds(a, 'm1', 's1', 1900);
    setOdds(b, 'm1', 's1', 2100);
    sync(a, b);

    const oddsA = readBoard(a).markets[0].selections[0].oddsMilli;
    const oddsB = readBoard(b).markets[0].selections[0].oddsMilli;
    expect(oddsA).toBe(oddsB); // converged
    expect([1900, 2100]).toContain(oddsA);
  });

  it('merges a shared slip built concurrently by two peers', () => {
    const a = new Y.Doc();
    seed(a);
    const b = new Y.Doc();
    sync(a, b);

    toggleSlip(a, 'm1', 's1'); // a adds Home
    toggleSlip(b, 'm1', 's2'); // b adds Away
    sync(a, b);

    for (const doc of [a, b]) {
      const slip = readBoard(doc).slip;
      expect(slip.map((p) => p.selectionId).sort()).toEqual(['s1', 's2']);
    }
  });

  it('a new market added offline arrives after reconnect', () => {
    const a = new Y.Doc();
    seed(a);
    const b = new Y.Doc();
    sync(a, b);

    // b works "offline": a keeps editing, no sync
    createMarket(a, 'm2', 'Total Goals', 1);
    addSelection(a, 'm2', 's3', 'Over 2.5', 1800);
    // reconnect
    sync(a, b);

    expect(readBoard(b).markets.map((m) => m.id)).toEqual(['m1', 'm2']);
  });
});
