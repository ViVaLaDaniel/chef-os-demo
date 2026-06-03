import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { App } from './main';

// Mock the child components and external dependencies
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    }
  },
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  isSupabaseConfigured: true,
}));

vi.mock('./lib/chefOsRemote', () => ({
  bootstrapAndLoadChefOsWorkspace: vi.fn().mockResolvedValue({
    restaurantId: '123',
    tasks: [],
    inventoryItems: [],
    inventoryReports: [],
    activity: [],
    chatMessages: [],
  }),
  confirmRemoteInventoryReport: vi.fn(),
  createRemoteChannelMessage: vi.fn(),
  createRemoteInventoryReport: vi.fn(),
  resetRemoteDemoWorkspace: vi.fn(),
  updateRemoteShiftTask: vi.fn(),
}));

describe('App Component', () => {
  it('renders the initial layout with navigation', async () => {
    // Render the App component
    await act(async () => {
      render(<App />);
    });

    // Check if the bottom navigation is rendered by looking for common tab text
    // using getAllByText since multiple matching elements might be present (e.g., icons, titles)
    expect(screen.getAllByText('Смена').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ТТК').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Склад').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Цеха').length).toBeGreaterThan(0);
  });
});
