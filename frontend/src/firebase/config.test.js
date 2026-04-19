import { describe, it, expect, vi } from 'vitest';

// Mock firebase modules before importing config
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'test-app' }))
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  GoogleAuthProvider: vi.fn(() => ({
    setCustomParameters: vi.fn()
  })),
  FacebookAuthProvider: vi.fn(() => ({
    setCustomParameters: vi.fn()
  }))
}));

describe('Firebase Config', () => {
  it('initializes Firebase app', async () => {
    const { initializeApp } = await import('firebase/app');
    await import('./config');
    
    expect(initializeApp).toHaveBeenCalled();
  });

  it('exports auth instance', async () => {
    const config = await import('./config');
    expect(config.auth).toBeDefined();
  });

  it('exports googleProvider', async () => {
    const config = await import('./config');
    expect(config.googleProvider).toBeDefined();
  });

  it('exports facebookProvider', async () => {
    const config = await import('./config');
    expect(config.facebookProvider).toBeDefined();
  });

  it('exports default app', async () => {
    const config = await import('./config');
    expect(config.default).toBeDefined();
  });
});
