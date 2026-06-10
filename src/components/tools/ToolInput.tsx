import styles from './ToolInput.module.css';

interface ToolInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export function ToolInput({
  value,
  onChange,
  placeholder = '在此粘贴或输入内容...',
  label = '输入',
  rows = 12,
}: ToolInputProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
      />
    </div>
  );
}
