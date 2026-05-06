'use client';

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import type { BoardSnapshot } from '@/lib/board';
import { readBoard, setOdds, setSuspended, toggleSlip } from '@/lib/board';
import { getSession } from '@/lib/session';

export interface BoardActions {
  setOdds: (marketId: string, selectionId: string, oddsMilli: number) => void;
  setSuspended: (marketId: string, selectionId: string, suspended: boolean) => void;
  toggleSlip: (marketId: string, selectionId: string) => void;
}

const EMPTY: BoardSnapshot = { markets: [], slip: [] };

export function useBoard(): { board: BoardSnapshot; actions: BoardActions } {
  const snapshotRef = useRef<BoardSnapshot>(EMPTY);

  const subscribe = useCallback((onChange: () => void) => {
    const { doc } = getSession();
    const update = () => {
      snapshotRef.current = readBoard(doc);
      onChange();
    };
    update();
    doc.on('update', update);
    return () => doc.off('update', update);
  }, []);

  const getSnapshot = useCallback(() => snapshotRef.current, []);
  const board = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const actions = useMemo<BoardActions>(
    () => ({
      setOdds: (m, s, odds) => setOdds(getSession().doc, m, s, odds),
      setSuspended: (m, s, suspended) => setSuspended(getSession().doc, m, s, suspended),
      toggleSlip: (m, s) => toggleSlip(getSession().doc, m, s),
    }),
    [],
  );

  return { board, actions };
}

export interface Peer {
  clientId: number;
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

export function usePresence(): { peers: Peer[]; setCursor: (x: number, y: number) => void } {
  const peersRef = useRef<Peer[]>([]);

  const subscribe = useCallback((onChange: () => void) => {
    const { provider, doc } = getSession();
    const awareness = provider.awareness;
    const update = () => {
      const peers: Peer[] = [];
      awareness.getStates().forEach((state, clientId) => {
        if (clientId === doc.clientID) return;
        const user = (state as { user?: { name: string; color: string } }).user;
        const cursor = (state as { cursor?: { x: number; y: number } }).cursor ?? null;
        if (user) peers.push({ clientId, name: user.name, color: user.color, cursor });
      });
      peersRef.current = peers;
      onChange();
    };
    update();
    awareness.on('change', update);
    return () => awareness.off('change', update);
  }, []);

  const peers = useSyncExternalStore(
    subscribe,
    () => peersRef.current,
    () => peersRef.current,
  );

  const setCursor = useCallback((x: number, y: number) => {
    getSession().provider.awareness.setLocalStateField('cursor', { x, y });
  }, []);

  return { peers, setCursor };
}

// keep the local awareness cursor in sync with the pointer
export function useCursorBroadcast(): void {
  const { setCursor } = usePresence();
  useEffect(() => {
    const onMove = (e: PointerEvent) => setCursor(e.clientX, e.clientY);
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [setCursor]);
}
