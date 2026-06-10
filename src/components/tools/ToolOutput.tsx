import styles from './ToolOutput.module.css';
import { CopyButton } from './CopyButton';

interface ToolOutputProps {
  value: string;
  error?: string;
  label?: string;
  showCopy?: boolean;
  readonly?: boolean;
}

export function ToolOutput({
  value,
  error,
  label = '输出',
  showCopy = true,
  readonly = true,
}: ToolOutputProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        {showCopy && value && !error && <CopyButton text={value} />}
      </div>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <textarea
          className={styles.textarea}
          value={value}
          readOnly={readonly}
          placeholder="结果将显示在这里..."
          rows={12}
          spellCheck={false}
        />
      )}
    </div>
  );
}
