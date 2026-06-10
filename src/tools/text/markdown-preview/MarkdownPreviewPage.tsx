import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Eye, Code } from 'lucide-react';
import styles from './MarkdownPreviewPage.module.css';

const DEFAULT_MD = `# Markdown 预览

## 标题 2

**粗体** 和 *斜体*

- 列表项 1
- 列表项 2

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> 引用文本

[链接](https://example.com)
`;

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(DEFAULT_MD);
  const [html, setHtml] = useState('');
  const [mode, setMode] = useState<'split' | 'preview' | 'edit'>('split');

  useEffect(() => {
    const render = async () => {
      try {
        const raw = await marked.parse(input);
        setHtml(DOMPurify.sanitize(raw));
      } catch {
        setHtml('<p style="color:red">Markdown 解析错误</p>');
      }
    };
    render();
  }, [input]);

  const handleCopyHtml = useCallback(() => {
    navigator.clipboard.writeText(html);
  }, [html]);

  return (
    <div className={styles.page}>
      <ToolHeader title="Markdown 预览" description="实时编辑并预览 Markdown 渲染效果" />
      <div className={styles.toolbar}>
        <button className={mode === 'split' ? styles.btnActive : styles.btn} onClick={() => setMode('split')}>
          <Code size={14} /> 分屏
        </button>
        <button className={mode === 'edit' ? styles.btnActive : styles.btn} onClick={() => setMode('edit')}>
          <Code size={14} /> 编辑
        </button>
        <button className={mode === 'preview' ? styles.btnActive : styles.btn} onClick={() => setMode('preview')}>
          <Eye size={14} /> 预览
        </button>
        <button className={styles.btnSecondary} onClick={handleCopyHtml}>
          复制 HTML
        </button>
      </div>
      <div className={`${styles.main} ${mode === 'split' ? styles.split : mode === 'edit' ? styles.editOnly : styles.previewOnly}`}>
        {(mode === 'split' || mode === 'edit') && (
          <textarea
            className={styles.editor}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        )}
        {(mode === 'split' || mode === 'preview') && (
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
