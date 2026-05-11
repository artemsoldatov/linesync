'use client';

import type { Selection } from '@/lib/board';
import { formatDecimal } from '@/lib/odds';

interface Props {
  marketId: string;
  selection: Selection;
  inSlip: boolean;
  onStep: (delta: number) => void;
  onToggleSuspend: () => void;
  onToggleSlip: () => void;
}

export function SelectionRow({
  selection,
  inSlip,
  onStep,
  onToggleSuspend,
  onToggleSlip,
}: Props) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-3 py-2 transition-colors ${
        selection.suspended
          ? 'border-neutral-800 bg-neutral-900/40 text-neutral-500'
          : 'border-neutral-800 bg-neutral-900'
      }`}
    >
      <span className="flex-1 truncate text-sm text-neutral-200">{selection.label}</span>

      <div className="flex items-center gap-1">
        <button
          aria-label={`decrease ${selection.label} odds`}
          className="h-6 w-6 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          onClick={() => onStep(-50)}
          disabled={selection.suspended}
        >
          −
        </button>
        <span
          key={selection.oddsMilli}
          data-testid={`odds-${selection.id}`}
          className="w-12 text-center font-mono text-sm tabular-nums text-cyan-300 motion-safe:animate-[flash_0.4s_ease]"
        >
          {formatDecimal(selection.oddsMilli)}
        </span>
        <button
          aria-label={`increase ${selection.label} odds`}
          className="h-6 w-6 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          onClick={() => onStep(50)}
          disabled={selection.suspended}
        >
          +
        </button>
      </div>

      <button
        aria-label={`toggle suspend ${selection.label}`}
        className={`h-6 rounded px-2 text-xs ${
          selection.suspended
            ? 'bg-amber-900/60 text-amber-300'
            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
        }`}
        onClick={onToggleSuspend}
      >
        {selection.suspended ? 'susp' : 'live'}
      </button>

      <button
        aria-label={`${inSlip ? 'remove from' : 'add to'} slip ${selection.label}`}
        className={`h-6 w-6 rounded text-sm ${
          inSlip ? 'bg-cyan-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
        }`}
        onClick={onToggleSlip}
        disabled={selection.suspended}
      >
        {inSlip ? '✓' : '+'}
      </button>
    </div>
  );
}
