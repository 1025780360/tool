import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './HtmlEntityPage.module.css';

function encodeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return text.replace(/[&<>"']/g, (ch) => map[ch]);
}

function decodeHtml(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

export default function HtmlEntityPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = useCallback(() => {
    if (!input) { setOutput(''); setError(''); return; }
    try {
      setOutput(mode === 'encode' ? encodeHtml(input) : decodeHtml(input));
      setError('');
    } catch {
      setError('转换失败');
      setOutput('');
    }
  }, [input, mode]);

  return (
    <div className={styles.page}>
      <ToolHeader title="HTML 实体转换" description="对 HTML 特殊字符进行编码或解码" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <button className={mode === 'encode' ? styles.btn : styles.btnSecondary} onClick={() => { setMode('encode'); setOutput(''); }}>
            编码 (转义)
          </button>
          <button className={mode === 'decode' ? styles.btn : styles.btnSecondary} onClick={() => { setMode('decode'); setOutput(''); }}>
            解码 (还原)
          </button>
          <button className={styles.btnSecondary} onClick={handleConvert}>执行</button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder={mode === 'encode' ? '输入包含 HTML 标签的文本...' : '输入 HTML 实体字符串...'} rows={10} />
        <ToolOutput value={output} error={error} />
      </div>
    </div>
  );
}
