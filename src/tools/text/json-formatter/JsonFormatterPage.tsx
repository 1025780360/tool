import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './JsonFormatterPage.module.css';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, indent]);

  const compress = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const validate = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('请输入 JSON 数据');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput('✓ JSON 格式正确\n\n数据类型: ' + getJsonType(parsed) + '\n大小: ' + JSON.stringify(parsed).length + ' 字符');
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  return (
    <div className={styles.page}>
      <ToolHeader
        title="JSON 格式化"
        description="格式化、压缩、验证 JSON 数据"
      />

      <div className={styles.workspace}>
        <div className={styles.inputPane}>
          <ToolInput
            value={input}
            onChange={setInput}
            placeholder='粘贴 JSON 数据，例如：{"name":"张三","age":25}'
            label="输入"
            rows={14}
          />
        </div>

        <div className={styles.controls}>
          <button className={styles.btn} onClick={format}>
            格式化
          </button>
          <button className={styles.btnSecondary} onClick={compress}>
            压缩
          </button>
          <button className={styles.btnSecondary} onClick={validate}>
            验证
          </button>
          <label className={styles.option}>
            缩进:
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className={styles.select}
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={0}>Tab</option>
            </select>
          </label>
        </div>

        <div className={styles.outputPane}>
          <ToolOutput
            value={output}
            error={error}
            label="输出"
          />
        </div>
      </div>
    </div>
  );
}

function getJsonType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return '数组 (Array)';
  return typeof value === 'object' ? '对象 (Object)' : typeof value;
}
