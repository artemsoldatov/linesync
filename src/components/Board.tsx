'use client';

import { useBoard, useConnection, useCursorBroadcast, usePresence } from '@/hooks/useBoard';
import { Cursors, PresenceBar } from './Presence';
import { MarketCard } from './MarketCard';
import { SlipPanel } from './SlipPanel';

const MIN_ODDS = 1010;
const MAX_ODDS = 100_000;

export function Board() {
  const { board, actions } = useBoard();
  const { peers } = usePresence();
  const connected = useConnection();
  useCursorBroadcast();

  const slipIds = new Set(board.slip.map((p) => p.selectionId));

  const step = (marketId: string, selectionId: string, delta: number) => {
    const market = board.markets.find((m) => m.id === marketId);
    const selection = market?.selections.find((s) => s.id === selectionId);
    if (!selection) return;
    const next = Math.min(MAX_ODDS, Math.max(MIN_ODDS, selection.oddsMilli + delta));
    actions.setOdds(marketId, selectionId, next);
  };

  return (
    <div className="min-h-dvh bg-neutral-900 text-neutral-100">
      <Cursors peers={peers} />

      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <h1 className="text-lg font-semibold">linesync</h1>
        <PresenceBar peers={peers} connected={connected} />
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {board.markets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              slipIds={slipIds}
              onStep={step}
              onToggleSuspend={actions.setSuspended}
              onToggleSlip={actions.toggleSlip}
            />
          ))}
        </div>

        <SlipPanel slip={board.slip} onRemove={actions.toggleSlip} />
      </main>
    </div>
  );
}
