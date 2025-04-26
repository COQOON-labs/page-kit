import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders with different padding options', () => {
    const { rerender } = render(<Card padding="none">No Padding</Card>);
    let card = screen.getByText('No Padding').closest('div');
    expect(card).not.toHaveClass('p-3');
    expect(card).not.toHaveClass('p-4');
    expect(card).not.toHaveClass('p-6');
    
    rerender(<Card padding="sm">Small Padding</Card>);
    card = screen.getByText('Small Padding').closest('div');
    expect(card).toHaveClass('p-3');
    
    rerender(<Card padding="md">Medium Padding</Card>);
    card = screen.getByText('Medium Padding').closest('div');
    expect(card).toHaveClass('p-4');
    
    rerender(<Card padding="lg">Large Padding</Card>);
    card = screen.getByText('Large Padding').closest('div');
    expect(card).toHaveClass('p-6');
  });

  it('renders with different radius options', () => {
    const { rerender } = render(<Card radius="none">No Radius</Card>);
    let card = screen.getByText('No Radius').closest('div');
    expect(card).toHaveClass('rounded-none');
    
    rerender(<Card radius="sm">Small Radius</Card>);
    card = screen.getByText('Small Radius').closest('div');
    expect(card).toHaveClass('rounded-sm');
    
    rerender(<Card radius="md">Medium Radius</Card>);
    card = screen.getByText('Medium Radius').closest('div');
    expect(card).toHaveClass('rounded-md');
    
    rerender(<Card radius="lg">Large Radius</Card>);
    card = screen.getByText('Large Radius').closest('div');
    expect(card).toHaveClass('rounded-lg');
  });
  
  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Test</Card>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.textContent).toBe('Ref Test');
  });

  it('merges custom className with component classes', () => {
    render(<Card className="custom-class">Custom Class</Card>);
    const card = screen.getByText('Custom Class').closest('div');
    
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-white');
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies the correct default classes', () => {
    render(<CardHeader>Header Content</CardHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toHaveClass('mb-2');
  });

  it('merges custom className with default classes', () => {
    render(<CardHeader className="custom-header">Custom Header</CardHeader>);
    const header = screen.getByText('Custom Header');
    expect(header).toHaveClass('custom-header');
    expect(header).toHaveClass('mb-2');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies the correct default classes', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    const footer = screen.getByText('Footer Content');
    expect(footer).toHaveClass('mt-4');
    expect(footer).toHaveClass('pt-4');
    expect(footer).toHaveClass('border-t');
  });

  it('merges custom className with default classes', () => {
    render(<CardFooter className="custom-footer">Custom Footer</CardFooter>);
    const footer = screen.getByText('Custom Footer');
    expect(footer).toHaveClass('custom-footer');
    expect(footer).toHaveClass('mt-4');
  });
}); 