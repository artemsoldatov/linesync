'use client';

import { useBoard } from '@/hooks/useBoard';
import { MarketCard } from './MarketCard';

export function Board() {
  const { board } = useBoard();

  return (
    <div className="min-h-dvh bg-neutral-900 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4">
        <h1 className="text-lg font-semibold">linesync</h1>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 p-6 sm:grid-cols-2">
        {board.markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </main>
    </div>
  );
}
