import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import styles from './UnitConverterPage.module.css';

interface Unit { name: string; factor: number; }

const CATEGORIES: Record<string, { units: Unit[]; base: string }> = {
  length: {
    base: '米',
    units: [
      { name: '毫米 (mm)', factor: 0.001 },
      { name: '厘米 (cm)', factor: 0.01 },
      { name: '米 (m)', factor: 1 },
      { name: '千米 (km)', factor: 1000 },
      { name: '英寸 (in)', factor: 0.0254 },
      { name: '英尺 (ft)', factor: 0.3048 },
      { name: '英里 (mi)', factor: 1609.344 },
    ],
  },
  weight: {
    base: '千克',
    units: [
      { name: '毫克 (mg)', factor: 0.000001 },
      { name: '克 (g)', factor: 0.001 },
      { name: '千克 (kg)', factor: 1 },
      { name: '吨 (t)', factor: 1000 },
      { name: '盎司 (oz)', factor: 0.0283495 },
      { name: '磅 (lb)', factor: 0.453592 },
    ],
  },
  temperature: {
    base: '摄氏度',
    units: [
      { name: '摄氏度 (°C)', factor: 1 },
      { name: '华氏度 (°F)', factor: 1 },
      { name: '开尔文 (K)', factor: 1 },
    ],
  },
  data: {
    base: '字节',
    units: [
      { name: '比特 (bit)', factor: 0.125 },
      { name: '字节 (B)', factor: 1 },
      { name: 'KB', factor: 1024 },
      { name: 'MB', factor: 1048576 },
      { name: 'GB', factor: 1073741824 },
      { name: 'TB', factor: 1099511627776 },
    ],
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from.includes('°C')) celsius = value;
  else if (from.includes('°F')) celsius = (value - 32) * 5 / 9;
  else if (from.includes('K')) celsius = value - 273.15;
  else return value;

  if (to.includes('°C')) return celsius;
  if (to.includes('°F')) return celsius * 9 / 5 + 32;
  if (to.includes('K')) return celsius + 273.15;
  return value;
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState('length');
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState(2); // index for "米 / kg"
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = useCallback(() => {
    const val = parseFloat(input);
    if (isNaN(val)) { setResults({}); return; }

    const config = CATEGORIES[category];
    const from = config.units[fromUnit];
    const result: Record<string, string> = {};

    for (let i = 0; i < config.units.length; i++) {
      const to = config.units[i];
      let converted: number;
      if (category === 'temperature') {
        converted = convertTemperature(val, from.name, to.name);
      } else {
        converted = (val * from.factor) / to.factor;
      }
      const decimals = Math.abs(converted) < 0.01 ? 8 : Math.abs(converted) < 1 ? 6 : 2;
      result[to.name] = converted.toFixed(decimals);
    }
    setResults(result);
  }, [input, category, fromUnit]);

  const catEntries = Object.entries(CATEGORIES);
  const config = CATEGORIES[category];

  return (
    <div className={styles.page}>
      <ToolHeader title="单位换算" description="长度、重量、温度、数据存储单位换算" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <span className={styles.label}>类型:</span>
          {catEntries.map(([key, cfg]) => (
            <button key={key} className={category === key ? styles.btn : styles.btnSecondary} onClick={() => { setCategory(key); setResults({}); }}>
              {key === 'length' ? '长度' : key === 'weight' ? '重量' : key === 'temperature' ? '温度' : '数据'}
            </button>
          ))}
        </div>

        <div className={styles.inputRow}>
          <ToolInput value={input} onChange={setInput} placeholder="输入数值..." rows={2} label="数值" />
          <div className={styles.unitSelect}>
            <span className={styles.label}>单位:</span>
            <select value={fromUnit} onChange={(e) => setFromUnit(Number(e.target.value))} className={styles.select}>
              {config.units.map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
            <button className={styles.btnConvert} onClick={convert}>换算</button>
          </div>
        </div>

        {Object.keys(results).length > 0 && (
          <div className={styles.results}>
            {config.units.map((u) => (
              <div key={u.name} className={styles.row}>
                <span className={styles.unitName}>{u.name}</span>
                <code className={styles.value}>{results[u.name] || '-'}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
