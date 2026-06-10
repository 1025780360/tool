import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import styles from './NumberBasePage.module.css';

function convertNumber(value: string, fromBase: number): Record<string, string> {
  const num = parseInt(value, fromBase);
  if (isNaN(num)) return {};
  return {
    '二进制 (Bin)': num.toString(2),
    '八进制 (Oct)': num.toString(8),
    '十进制 (Dec)': num.toString(10),
    '十六进制 (Hex)': num.toString(16).toUpperCase(),
  };
}

export default function NumberBasePage() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = useCallback(() => {
    if (!input.trim()) { setResults({}); return; }
    setResults(convertNumber(input.trim(), fromBase));
  }, [input, fromBase]);

  const bases = [
    { label: '二进制', value: 2 },
    { label: '八进制', value: 8 },
    { label: '十进制', value: 10 },
    { label: '十六进制', value: 16 },
  ];

  return (
    <div className={styles.page}>
      <ToolHeader title="进制转换" description="在二进制、八进制、十进制、十六进制之间转换" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <span className={styles.label}>输入进制:</span>
          {bases.map((b) => (
            <button key={b.value} className={fromBase === b.value ? styles.btn : styles.btnSecondary} onClick={() => setFromBase(b.value)}>
              {b.label}
            </button>
          ))}
          <button className={styles.btnSecondary} onClick={convert}>转换</button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder={`输入${bases.find((b) => b.value === fromBase)?.label}数值...`} rows={4} />
        {Object.keys(results).length > 0 && (
          <div className={styles.results}>
            {Object.entries(results).map(([label, value]) => (
              <div key={label} className={styles.resultRow}>
                <span className={styles.resultLabel}>{label}</span>
                <code className={styles.resultValue}>{value}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
