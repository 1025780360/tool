import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/reset.css';
import './assets/styles/index.css';
import App from './App';

// Side-effect: auto-register all tools
import.meta.glob('./tools/**/index.ts', { eager: true });

// ===== Instant button response =====
// Fire onClick immediately on pointerdown to eliminate the ~100ms delay
// between physical press and the click event.
const lastFire = new WeakMap<HTMLElement, number>();

document.addEventListener(
  'pointerdown',
  (e) => {
    const btn = (e.target as HTMLElement).closest('button, [role="button"]') as HTMLElement | null;
    if (!btn || (btn as HTMLButtonElement).disabled) return;
    const now = Date.now();
    const prev = lastFire.get(btn) || 0;
    if (now - prev < 150) return; // debounce
    lastFire.set(btn, now);
    btn.click();
  },
  { capture: true }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
