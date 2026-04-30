'use client';

import type { Market } from '@/lib/board';
import { SelectionRow } from './SelectionRow';

interface Props {
  market: Market;
  slipIds: Set<string>;
  onStep: (marketId: string, selectionId: string, delta: number) => void;
  onToggleSuspend: (marketId: string, selectionId: string, next: boolean) => void;
  onToggleSlip: (marketId: string, selectionId: string) => void;
}

export function MarketCard({ market, slipIds, onStep, onToggleSuspend, onToggleSlip }: Props) {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-300">{market.name}</h3>
      <div className="flex flex-col gap-2">
        {market.selections.map((selection) => (
          <SelectionRow
            key={selection.id}
            marketId={market.id}
            selection={selection}
            inSlip={slipIds.has(selection.id)}
            onStep={(delta) => onStep(market.id, selection.id, delta)}
            onToggleSuspend={() => onToggleSuspend(market.id, selection.id, !selection.suspended)}
            onToggleSlip={() => onToggleSlip(market.id, selection.id)}
          />
        ))}
      </div>
    </section>
  );
}
