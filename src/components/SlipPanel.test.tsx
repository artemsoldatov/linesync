import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SlipPick } from '@/lib/board';
import { SlipPanel } from './SlipPanel';

const picks: SlipPick[] = [
  { selectionId: 's1', marketId: 'm1', label: 'Home', oddsMilli: 2000 },
  { selectionId: 's4', marketId: 'm2', label: 'Over 2.5', oddsMilli: 1500 },
];

describe('SlipPanel', () => {
  it('shows an empty state', () => {
    render(<SlipPanel slip={[]} onRemove={vi.fn()} />);
    expect(screen.getByText(/build a slip together/i)).toBeInTheDocument();
  });

  it('lists picks and the combined parlay odds', () => {
    render(<SlipPanel slip={picks} onRemove={vi.fn()} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Over 2.5')).toBeInTheDocument();
    expect(screen.getByText('2-fold parlay')).toBeInTheDocument();
    // 2.0 x 1.5 = 3.00
    expect(screen.getByText('3.00')).toBeInTheDocument();
  });
});
