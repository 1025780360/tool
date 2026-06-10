import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolOutput } from '@/components/tools/ToolOutput';
import styles from './LoremIpsumPage.module.css';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

const PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
];

function generateParagraphs(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(PARAGRAPHS[i % PARAGRAPHS.length]);
  }
  return result.join('\n\n');
}

function generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = 8 + Math.floor(Math.random() * 12);
    const words: string[] = [];
    for (let j = 0; j < len; j++) {
      words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    const s = words.join(' ');
    sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
  }
  return sentences.join(' ');
}

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return words.join(' ');
}

export default function LoremIpsumPage() {
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);

  const generate = useCallback(() => {
    let result = '';
    switch (mode) {
      case 'paragraphs': result = generateParagraphs(count); break;
      case 'sentences': result = generateSentences(count); break;
      case 'words': result = generateWords(count); break;
    }
    setOutput(result);
  }, [mode, count]);

  return (
    <div className={styles.page}>
      <ToolHeader title="Lorem Ipsum 生成器" description="生成占位文本用于设计和排版" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <button className={mode === 'paragraphs' ? styles.btn : styles.btnSecondary} onClick={() => setMode('paragraphs')}>段落</button>
          <button className={mode === 'sentences' ? styles.btn : styles.btnSecondary} onClick={() => setMode('sentences')}>句子</button>
          <button className={mode === 'words' ? styles.btn : styles.btnSecondary} onClick={() => setMode('words')}>单词</button>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className={styles.numInput} />
          <button className={styles.btnSecondary} onClick={generate}>生成</button>
        </div>
        <ToolOutput value={output} />
      </div>
    </div>
  );
}
