import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Toggle from '@/components/ui/Toggle';

describe('Toggle', () => {
  it('renders label and unchecked state', () => {
    render(<Toggle label="Slideshow" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Slideshow')).toBeDefined();
  });

  it('calls onChange when clicked', () => {
    const onChange = vi.fn();
    render(<Toggle label="Slideshow" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByText('Slideshow'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('shows checked styling when active', () => {
    render(<Toggle label="Slideshow" checked={true} onChange={() => {}} />);
    const btn = screen.getByText('Slideshow').closest('button');
    expect(btn?.className).toContain('bg-accent');
  });
});
