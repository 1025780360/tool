import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './ShaPage.module.css';

type ShaAlgo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

async function shaHash(text: string, algo: ShaAlgo): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function ShaPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algo, setAlgo] = useState<ShaAlgo>('SHA-256');
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    if (!input) { setOutput(''); return; }
    setLoading(true);
    try {
      const hash = await shaHash(input, algo);
      setOutput(hash);
    } catch {
      setOutput('生成失败');
    }
    setLoading(false);
  }, [input, algo]);

  const algos: ShaAlgo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  return (
    <div className={styles.page}>
      <ToolHeader title="SHA 哈希" description="使用 Web Crypto API 生成 SHA 系列哈希值" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          {algos.map((a) => (
            <button key={a} className={algo === a ? styles.btn : styles.btnSecondary} onClick={() => setAlgo(a)}>
              {a}
            </button>
          ))}
          <button className={styles.btnPrimary} onClick={generate} disabled={loading}>
            {loading ? '计算中...' : '生成哈希'}
          </button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder="输入文本..." rows={8} />
        <ToolOutput value={output} label={`${algo} 哈希值`} />
      </div>
    </div>
  );
}
