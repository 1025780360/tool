import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './Base64Page.module.css';

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToUtf8(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const result = mode === 'encode' ? utf8ToBase64(input) : base64ToUtf8(input.trim());
      setOutput(result);
      setError('');
    } catch {
      setError(mode === 'encode' ? '编码失败，请检查输入内容' : '解码失败，请输入有效的 Base64 字符串');
      setOutput('');
    }
  }, [input, mode]);

  return (
    <div className={styles.page}>
      <ToolHeader title="Base64 编解码" description="将文本编码为 Base64，或将 Base64 解码为文本" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <button
            className={mode === 'encode' ? styles.btn : styles.btnSecondary}
            onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          >
            编码 (文本 → Base64)
          </button>
          <button
            className={mode === 'decode' ? styles.btn : styles.btnSecondary}
            onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          >
            解码 (Base64 → 文本)
          </button>
          <button className={styles.btnSecondary} onClick={handleConvert}>
            执行转换
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder={mode === 'encode' ? '输入要编码的文本（支持中文）...' : '输入 Base64 字符串...'}
          rows={10}
        />
        <ToolOutput value={output} error={error} />
      </div>
    </div>
  );
}
