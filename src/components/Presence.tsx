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
