'use client';

import type { Market } from '@/lib/board';
import { SelectionRow } from './SelectionRow';

interface Props {
  market: Market;
}

export function MarketCard({ market }: Props) {
  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-300">{market.name}</h3>
      <div className="flex flex-col gap-2">
        {market.selections.map((selection) => (
          <SelectionRow key={selection.id} marketId={market.id} selection={selection} />
        ))}
      </div>
    </section>
  );
}
