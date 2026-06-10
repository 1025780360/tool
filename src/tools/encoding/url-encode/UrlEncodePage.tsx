import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import toolStyles from './UrlEncodePage.module.css';

export default function UrlEncodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input.trim()));
      setError('');
    } catch {
      setError('解码失败，请输入有效的 URL 编码字符串');
      setOutput('');
    }
  }, [input, mode]);

  const encodeFull = useCallback(() => {
    if (!input) return;
    setOutput(encodeURI(input));
    setError('');
  }, [input]);

  const styles = toolStyles;

  return (
    <div className={styles.page}>
      <ToolHeader title="URL 编解码" description="对 URL 中的特殊字符进行编码或解码" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <button className={mode === 'encode' ? styles.btn : styles.btnSecondary} onClick={() => { setMode('encode'); setOutput(''); setError(''); }}>
            编码 (encodeURIComponent)
          </button>
          <button className={mode === 'decode' ? styles.btn : styles.btnSecondary} onClick={() => { setMode('decode'); setOutput(''); setError(''); }}>
            解码
          </button>
          <button className={styles.btnSecondary} onClick={handleConvert}>执行</button>
          <button className={styles.btnSecondary} onClick={encodeFull}>编码完整 URL</button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder={mode === 'encode' ? '输入要编码的文本或 URL...' : '输入编码后的字符串...'} rows={10} />
        <ToolOutput value={output} error={error} />
      </div>
    </div>
  );
}
