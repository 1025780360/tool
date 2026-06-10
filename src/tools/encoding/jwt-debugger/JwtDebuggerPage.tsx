import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import styles from './JwtDebuggerPage.module.css';

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return atob(str);
  }
}

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
}

function decodeJwt(token: string): JwtParts | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
    const payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}

export default function JwtDebuggerPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'payload' | 'header'>('payload');

  const decode = useCallback(() => {
    if (!input.trim()) { setResult(null); setError(''); return; }
    const decoded = decodeJwt(input.trim());
    if (!decoded) {
      setError('无效的 JWT Token。JWT 应包含三个由点号分隔的部分。');
      setResult(null);
    } else {
      setResult(decoded);
      setError('');
    }
  }, [input]);

  const payload = result?.payload ? JSON.parse(result.payload) : null;
  const exp = payload?.exp;
  const iat = payload?.iat;
  const now = Math.floor(Date.now() / 1000);

  return (
    <div className={styles.page}>
      <ToolHeader title="JWT 调试器" description="解码 JWT Token，查看 Header、Payload 和签名" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <button className={styles.btn} onClick={decode}>解码</button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder="粘贴 JWT Token (eyJhbGciOiJSUzI1NiIs...)" rows={4} />

        {error && <div className={styles.error}>{error}</div>}

        {result && (
          <>
            {payload && (
              <div className={styles.infoBar}>
                {exp && (
                  <span className={exp < now ? styles.expBadgeExpired : styles.expBadge}>
                    {exp < now ? '⚠ 已过期' : '✓ 有效'} | 过期时间: {new Date(exp * 1000).toLocaleString()}
                  </span>
                )}
                {iat && <span className={styles.infoText}>签发时间: {new Date(iat * 1000).toLocaleString()}</span>}
              </div>
            )}

            <div className={styles.tabs}>
              <button className={activeTab === 'payload' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('payload')}>Payload</button>
              <button className={activeTab === 'header' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('header')}>Header</button>
            </div>

            <pre className={styles.code}>
              {activeTab === 'payload' ? result.payload : result.header}
            </pre>

            <div className={styles.sigBox}>
              <span className={styles.sigLabel}>签名 (Signature):</span>
              <code className={styles.sigValue}>{result.signature.length > 40 ? result.signature.slice(0, 40) + '...' : result.signature}</code>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
