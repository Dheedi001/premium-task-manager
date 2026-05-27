import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './ThemeContext';
import PremiumTodo from './App';

describe('Priority.ai Integration Tests (UI + Global State)', () => {

  const renderWithProviders = () => {
    return render(
      <Provider store={store}>
        <ThemeProvider>
          <PremiumTodo />
        </ThemeProvider>
      </Provider>
    );
  };

  it('renders the main dashboard and global context successfully', () => {
    renderWithProviders();

    // 1. Look for the NEW header we created in Week 8
    expect(screen.getByText('Active Store')).toBeInTheDocument();
    
    // 2. Look for the Analytics widget
    expect(screen.getByText('Sprint Completion')).toBeInTheDocument();
  });

  it('simulates user interaction with the Workspace filters', () => {
    renderWithProviders();

    const pendingButton = screen.getByText('Pending');
    fireEvent.click(pendingButton);

    expect(pendingButton).toBeInTheDocument();
  });

});