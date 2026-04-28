'use client';

import type { Market } from '@/lib/board';
import { SelectionRow } from './SelectionRow';

interface Props {
  market: Market;
  onStep: (marketId: string, selectionId: string, delta: number) => void;
  onToggleSuspend: (marketId: string, selectionId: string, next: boolean) => void;
}

export function MarketCard({ market, onStep, onToggleSuspend }: Props) {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-300">{market.name}</h3>
      <div className="flex flex-col gap-2">
        {market.selections.map((selection) => (
          <SelectionRow
            key={selection.id}
            marketId={market.id}
            selection={selection}
            onStep={(delta) => onStep(market.id, selection.id, delta)}
            onToggleSuspend={() => onToggleSuspend(market.id, selection.id, !selection.suspended)}
          />
        ))}
      </div>
    </section>
  );
}
