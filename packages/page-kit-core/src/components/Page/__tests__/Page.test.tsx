import React from 'react';
import { render, screen } from '@testing-library/react';
import { Page } from '..';

// Mock window.addEventListener to simulate resize
const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

describe('Page', () => {
  beforeEach(() => {
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  it('renders children correctly', () => {
    render(<Page>Page Content</Page>);
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('sets up resize listener on mount and cleans up on unmount', () => {
    const { unmount } = render(<Page>Page Content</Page>);
    
    // Check that resize listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    // Unmount component
    unmount();
    
    // Check that resize listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('applies custom max width', () => {
    const { container } = render(<Page maxWidth={600}>Page Content</Page>);
    const pageContainer = container.querySelector('.page-container');
    
    expect(pageContainer).toHaveStyle({ maxWidth: '600px' });
  });

  it('applies custom container width percentage', () => {
    const { container } = render(<Page containerWidth={80}>Page Content</Page>);
    const pageContainer = container.querySelector('.page-container');
    
    expect(pageContainer).toHaveStyle({ width: '80%' });
  });

  it('applies custom background color', () => {
    const { container } = render(<Page background="#f0f0f0">Page Content</Page>);
    const page = container.querySelector('.page');
    
    expect(page).toHaveStyle({ backgroundColor: '#f0f0f0' });
  });

  it('applies shadow when shadow prop is true', () => {
    const { container } = render(<Page shadow={true}>Page Content</Page>);
    const page = container.querySelector('.page');
    
    expect(page).toHaveClass('shadow-lg');
  });

  it('does not apply shadow when shadow prop is false', () => {
    const { container } = render(<Page shadow={false}>Page Content</Page>);
    const page = container.querySelector('.page');
    
    expect(page).not.toHaveClass('shadow-lg');
  });

  it('applies custom padding', () => {
    const { container } = render(<Page padding={10}>Page Content</Page>);
    const page = container.querySelector('.page');
    
    expect(page).toHaveStyle({ padding: '20mm 20mm 20mm 20mm' });
  });
}); 