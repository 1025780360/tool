import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTool } from '@/config/tool.registry';
import type { ToolConfig } from '@/types/tool';

const MAX_RECENT = 6;

export function useRecentTools(): {
  recentTools: ToolConfig[];
  addRecent: (toolId: string) => void;
} {
  const [recentIds, setRecentIds] = useLocalStorage<string[]>('recent-tools', []);

  const addRecent = useCallback(
    (toolId: string) => {
      setRecentIds((prev) => {
        const filtered = prev.filter((id) => id !== toolId);
        return [toolId, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setRecentIds]
  );

  const recentTools = recentIds
    .map((id) => getTool(id))
    .filter((t): t is ToolConfig => t !== undefined);

  return { recentTools, addRecent };
}
