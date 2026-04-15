import * as Y from 'yjs';

// The board is a Yjs document. Markets and selections are nested Y.Maps so two
// people editing different lines never conflict. All money-ish values are
// integer milli-units.

export interface Selection {
  id: string;
  label: string;
  oddsMilli: number;
  suspended: boolean;
}

export interface Market {
  id: string;
  name: string;
  order: number;
  selections: Selection[];
}

export interface BoardSnapshot {
  markets: Market[];
}

type YMapAny = Y.Map<unknown>;

function marketsMap(doc: Y.Doc): YMapAny {
  return doc.getMap('markets');
}

export function createMarket(doc: Y.Doc, id: string, name: string, order: number): void {
  doc.transact(() => {
    const market = new Y.Map();
    market.set('id', id);
    market.set('name', name);
    market.set('order', order);
    market.set('selections', new Y.Map());
    marketsMap(doc).set(id, market);
  });
}

function selectionsOf(doc: Y.Doc, marketId: string): YMapAny | undefined {
  const market = marketsMap(doc).get(marketId) as YMapAny | undefined;
  return market?.get('selections') as YMapAny | undefined;
}

export function addSelection(
  doc: Y.Doc,
  marketId: string,
  id: string,
  label: string,
  oddsMilli: number,
): void {
  doc.transact(() => {
    const selections = selectionsOf(doc, marketId);
    if (!selections) return;
    const sel = new Y.Map();
    sel.set('id', id);
    sel.set('label', label);
    sel.set('oddsMilli', oddsMilli);
    sel.set('suspended', false);
    selections.set(id, sel);
  });
}

export function readBoard(doc: Y.Doc): BoardSnapshot {
  const markets: Market[] = [];
  marketsMap(doc).forEach((value) => {
    const market = value as YMapAny;
    const selections: Selection[] = [];
    (market.get('selections') as YMapAny | undefined)?.forEach((selValue) => {
      const sel = selValue as YMapAny;
      selections.push({
        id: sel.get('id') as string,
        label: sel.get('label') as string,
        oddsMilli: sel.get('oddsMilli') as number,
        suspended: (sel.get('suspended') as boolean | undefined) ?? false,
      });
    });
    selections.sort((a, b) => a.id.localeCompare(b.id));
    markets.push({
      id: market.get('id') as string,
      name: market.get('name') as string,
      order: (market.get('order') as number | undefined) ?? 0,
      selections,
    });
  });
  markets.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  return { markets };
}
