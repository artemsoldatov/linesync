'use client';

import type { SlipPick } from '@/lib/board';
import { formatDecimal, parlayMilli } from '@/lib/odds';

interface Props {
  slip: SlipPick[];
  onRemove: (marketId: string, selectionId: string) => void;
}

export function SlipPanel({ slip, onRemove }: Props) {
  const parlay = parlayMilli(slip.map((p) => p.oddsMilli));

  return (
    <aside className="flex h-full w-full flex-col rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
        Shared slip
      </h2>

      {slip.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Add selections to build a slip together — everyone in the room edits the same one.
        </p>
      ) : (
        <ul className="flex flex-col gap-2" style={{ viewTransitionName: 'slip' }}>
          {slip.map((pick) => (
            <li
              key={pick.selectionId}
              className="flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-2"
            >
              <span className="flex-1 truncate text-sm text-neutral-200">{pick.label}</span>
              <span className="font-mono text-sm tabular-nums text-cyan-300">
                {formatDecimal(pick.oddsMilli)}
              </span>
              <button
                aria-label={`remove ${pick.label} from slip`}
                className="text-neutral-500 hover:text-neutral-300"
                onClick={() => onRemove(pick.marketId, pick.selectionId)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {slip.length > 0 && (
        <div className="mt-auto flex items-center justify-between border-t border-neutral-800 pt-3">
          <span className="text-sm text-neutral-400">{slip.length}-fold parlay</span>
          <span className="font-mono text-lg font-semibold tabular-nums text-cyan-300">
            {formatDecimal(parlay)}
          </span>
        </div>
      )}
    </aside>
  );
}
