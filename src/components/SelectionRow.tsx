'use client';

import type { Selection } from '@/lib/board';
import { formatDecimal } from '@/lib/odds';

interface Props {
  marketId: string;
  selection: Selection;
}

export function SelectionRow({ selection }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
      <span className="flex-1 truncate text-sm text-neutral-200">{selection.label}</span>
      <span className="w-12 text-center font-mono text-sm tabular-nums text-cyan-300">
        {formatDecimal(selection.oddsMilli)}
      </span>
    </div>
  );
}
