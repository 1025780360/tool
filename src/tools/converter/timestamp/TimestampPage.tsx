import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './TimestampPage.module.css';

function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function TimestampPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'ts2date' | 'date2ts'>('ts2date');

  const convert = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      if (mode === 'ts2date') {
        let ts = Number(input.trim());
        if (ts > 9999999999999) ts = Math.floor(ts / 1000000); // nanoseconds
        if (ts > 99999999999) ts = Math.floor(ts / 1000); // milliseconds
        const d = new Date(ts * 1000);
        if (isNaN(d.getTime())) throw new Error('Invalid');
        const sec = ts;
        const ms = ts * 1000;
        const now = Date.now();
        const diff = now - ms;
        const rel = diff < 0 ? `${Math.abs(Math.round(diff / 1000))} 秒后` : diff < 60000 ? `${Math.round(diff / 1000)} 秒前` : diff < 3600000 ? `${Math.round(diff / 60000)} 分钟前` : diff < 86400000 ? `${Math.round(diff / 3600000)} 小时前` : `${Math.round(diff / 86400000)} 天前`;
        setOutput(
          `UTC: ${d.toUTCString()}\n本地: ${formatDateTime(d)}\nISO: ${d.toISOString()}\n\n秒级时间戳: ${sec}\n毫秒级时间戳: ${ms}\n相对时间: ${rel}`
        );
      } else {
        const d = new Date(input.trim());
        if (isNaN(d.getTime())) throw new Error('Invalid');
        setOutput(`秒级: ${Math.floor(d.getTime() / 1000)}\n毫秒级: ${d.getTime()}`);
      }
    } catch {
      setOutput('输入无效，请检查格式');
    }
  }, [input, mode]);

  const now = useCallback(() => {
    const ts = Math.floor(Date.now() / 1000);
    setInput(String(ts));
    setMode('ts2date');
  }, []);

  return (
    <div className={styles.page}>
      <ToolHeader title="时间戳转换" description="Unix 时间戳与日期时间互相转换" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <button className={mode === 'ts2date' ? styles.btn : styles.btnSecondary} onClick={() => setMode('ts2date')}>时间戳 → 日期</button>
          <button className={mode === 'date2ts' ? styles.btn : styles.btnSecondary} onClick={() => setMode('date2ts')}>日期 → 时间戳</button>
          <button className={styles.btnSecondary} onClick={convert}>转换</button>
          <button className={styles.btnSecondary} onClick={now}>当前时间戳</button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder={mode === 'ts2date' ? '输入时间戳，如 1700000000...' : '输入日期，如 2024-01-01 或 2024-01-01T00:00:00Z...'} rows={6} />
        <ToolOutput value={output} />
      </div>
    </div>
  );
}
