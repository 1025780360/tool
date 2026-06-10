import type { ToolConfig } from '@/types/tool';
import { ToolCard } from './ToolCard';
import { EmptyState } from './EmptyState';
import styles from './ToolGrid.module.css';

interface ToolGridProps {
  tools: ToolConfig[];
  emptyMessage?: string;
}

export function ToolGrid({ tools, emptyMessage = '没有找到匹配的工具' }: ToolGridProps) {
  if (tools.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={styles.grid}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
