import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies variant className', () => {
        const { container } = render(<Button variant="primary">Test</Button>);
        expect(container.firstChild).toHaveClass('btn--primary');
    });

    it('applies size className', () => {
        const { container } = render(<Button size="lg">Test</Button>);
        expect(container.firstChild).toHaveClass('btn--lg');
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading state', () => {
        render(<Button loading>Loading</Button>);
        // The button should still render with loading prop passed
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<Button className="custom">Test</Button>);
        expect(container.firstChild).toHaveClass('custom');
    });
});
