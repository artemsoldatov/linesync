import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';
import { addSelection, createMarket, readBoard } from './board';

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
