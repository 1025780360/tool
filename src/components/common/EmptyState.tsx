import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = '没有找到匹配的工具' }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <SearchX size={48} className={styles.icon} />
      <p className={styles.message}>{message}</p>
      <p className={styles.hint}>试试其他关键词</p>
    </div>
  );
}
