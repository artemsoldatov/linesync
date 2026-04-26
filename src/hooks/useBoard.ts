'use client';

import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
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
