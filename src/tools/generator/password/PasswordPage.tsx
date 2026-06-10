import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './PasswordPage.module.css';

const CHAR_SETS: Record<string, string> = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length: number, sets: string[]): string {
  const pool = sets.map((s) => CHAR_SETS[s]).join('');
  if (!pool) return '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pool[array[i] % pool.length];
  }
  return result;
}

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [sets, setSets] = useState<string[]>(['uppercase', 'lowercase', 'numbers', 'symbols']);

  const toggleSet = (key: string) => {
    setSets((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
  };

  const generate = useCallback(() => {
    setPassword(generatePassword(length, sets));
  }, [length, sets]);

  return (
    <div className={styles.page}>
      <ToolHeader title="密码生成器" description="使用 crypto.getRandomValues 生成安全随机密码" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <label className={styles.option}>
            长度:
            <input type="number" min={4} max={128} value={length} onChange={(e) => setLength(Math.min(128, Math.max(4, Number(e.target.value))))} className={styles.numberInput} />
          </label>
          {Object.entries(CHAR_SETS).map(([key, chars]) => (
            <label key={key} className={styles.option}>
              <input type="checkbox" checked={sets.includes(key)} onChange={() => toggleSet(key)} />
              {key === 'uppercase' ? '大写 (A-Z)' : key === 'lowercase' ? '小写 (a-z)' : key === 'numbers' ? '数字 (0-9)' : `符号 (${chars.slice(0, 8)}...)`}
            </label>
          ))}
          <button className={styles.btn} onClick={generate}>生成密码</button>
        </div>
        {password && <ToolOutput value={password} label="生成的密码" />}
      </div>
    </div>
  );
}
