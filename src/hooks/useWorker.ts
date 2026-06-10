import { useRef, useEffect, useCallback } from 'react';

/**
 * Manage a Web Worker lifecycle.
 * Returns `{ post }` — call `post(data)` to send a message to the worker.
 * The `onMessage` callback receives responses.
 */
export function useWorker<TIn = unknown, TOut = unknown>(
  workerFactory: () => Worker,
  onMessage: (data: TOut) => void
) {
  const workerRef = useRef<Worker | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const worker = workerFactory();
    worker.onmessage = (e: MessageEvent<TOut>) => {
      onMessageRef.current(e.data);
    };
    worker.onerror = (e) => {
      console.error('Worker error:', e);
    };
    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const post = useCallback((data: TIn) => {
    workerRef.current?.postMessage(data);
  }, []);

  return { post };
}
