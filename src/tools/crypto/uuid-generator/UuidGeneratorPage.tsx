import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './UuidGeneratorPage.module.css';

function generateUUID(): string {
  return crypto.randomUUID();
}

function generateUUIDNoDash(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [noDash, setNoDash] = useState(false);

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(noDash ? generateUUIDNoDash() : generateUUID());
    }
    setUuids(results);
  }, [count, noDash]);

  return (
    <div className={styles.page}>
      <ToolHeader title="UUID 生成器" description="生成 UUID v4 随机标识符" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <label className={styles.option}>
            数量:
            <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))} className={styles.numberInput} />
          </label>
          <label className={styles.option}>
            <input type="checkbox" checked={noDash} onChange={(e) => setNoDash(e.target.checked)} />
            去除连字符
          </label>
          <button className={styles.btn} onClick={generate}>生成</button>
        </div>
        <ToolOutput value={uuids.join('\n')} label={`生成的 UUID (${uuids.length})`} />
      </div>
    </div>
  );
}
