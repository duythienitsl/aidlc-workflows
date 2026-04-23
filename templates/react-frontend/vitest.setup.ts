import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

/** jsdom does not implement IntersectionObserver (common for infinite scroll / lazy UI). */
globalThis.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = (): IntersectionObserverEntry[] => [];
  unobserve = vi.fn();
} as unknown as typeof IntersectionObserver;
