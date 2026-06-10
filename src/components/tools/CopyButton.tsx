import { Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, copy] = useClipboard();

  return (
    <button
      className={styles.btn}
      onClick={() => copy(text)}
      title={copied ? '已复制' : '复制到剪贴板'}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span>{copied ? '已复制' : '复制'}</span>
    </button>
  );
}
