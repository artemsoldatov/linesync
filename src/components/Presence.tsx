'use client';

import type { Peer } from '@/hooks/useBoard';

export function PresenceBar({ peers }: { peers: Peer[] }) {
  return (
    <div className="flex -space-x-2">
      {peers.map((peer) => (
        <span
          key={peer.clientId}
          title={peer.name}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-950 text-xs font-medium text-neutral-950"
          style={{ backgroundColor: peer.color }}
        >
          {peer.name[0]}
        </span>
      ))}
    </div>
  );
}

export function Cursors({ peers }: { peers: Peer[] }) {
  return (
    <>
      {peers
        .filter((p) => p.cursor)
        .map((peer) => (
          <div
            key={peer.clientId}
            className="pointer-events-none fixed z-50 transition-transform duration-75"
            style={{ transform: `translate(${peer.cursor!.x}px, ${peer.cursor!.y}px)` }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 6-6 2-2 6z" fill={peer.color} />
            </svg>
            <span
              className="ml-3 rounded px-1.5 py-0.5 text-xs text-neutral-950"
              style={{ backgroundColor: peer.color }}
            >
              {peer.name}
            </span>
          </div>
        ))}
    </>
  );
}
