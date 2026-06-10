import { useState, useCallback, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { Download } from 'lucide-react';
import styles from './QrcodePage.module.css';

export default function QrcodePage() {
  const [input, setInput] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!input.trim()) { setQrDataUrl(''); setError(''); return; }
    try {
      const url = await QRCode.toDataURL(input, {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setQrDataUrl(url);
      setError('');
    } catch {
      setError('二维码生成失败，请检查输入内容');
      setQrDataUrl('');
    }
  }, [input, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.src = qrDataUrl;
  }, [qrDataUrl, size]);

  const download = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className={styles.page}>
      <ToolHeader title="二维码生成" description="将文本或链接生成二维码图片" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <label className={styles.option}>
            尺寸:
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={styles.select}>
              <option value={128}>128px</option>
              <option value={256}>256px</option>
              <option value={384}>384px</option>
              <option value={512}>512px</option>
            </select>
          </label>
          <button className={styles.btn} onClick={generate}>生成二维码</button>
        </div>
        <ToolInput value={input} onChange={setInput} placeholder="输入文本、URL 或任意内容..." rows={4} />
        {error && <div className={styles.error}>{error}</div>}
        {qrDataUrl && (
          <div className={styles.result}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <button className={styles.downloadBtn} onClick={download}>
              <Download size={16} />
              下载 PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
