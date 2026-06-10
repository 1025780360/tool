import { useState, useCallback } from 'react';

/**
 * Copy text to clipboard hook.
 * Returns [copied, copy] — `copied` is true for ~2s after a successful copy.
 */
export function useClipboard(resetDelay = 2000): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      } catch {
        // Fallback for older browsers / insecure contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      }
    },
    [resetDelay]
  );

  return [copied, copy];
}
