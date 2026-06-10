import { useState, useCallback, useRef } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Upload, Download } from 'lucide-react';
import styles from './ConvertFormatPage.module.css';

type Format = 'image/png' | 'image/jpeg' | 'image/webp';
const FORMATS: { value: Format; label: string; ext: string }[] = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
];

export default function ConvertFormatPage() {
  const [source, setSource] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [targetFormat, setTargetFormat] = useState<Format>('image/png');
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setSource(file);
    setResultUrl('');
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      convertFormat(dataUrl, targetFormat);
    };
    reader.readAsDataURL(file);
  }, [targetFormat]);

  const convertFormat = useCallback((dataUrl: string, format: Format) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const quality = format === 'image/jpeg' ? 0.92 : undefined;
      const url = canvas.toDataURL(format, quality);
      setResultUrl(url);
      setError('');
    };
    img.onerror = () => setError('图片加载失败');
    img.src = dataUrl;
  }, []);

  const handleFormatChange = useCallback((format: Format) => {
    setTargetFormat(format);
    if (preview) convertFormat(preview, format);
  }, [preview, convertFormat]);

  const download = useCallback(() => {
    if (!resultUrl || !source) return;
    const a = document.createElement('a');
    const ext = FORMATS.find((f) => f.value === targetFormat)!.ext;
    const name = source.name.replace(/\.[^.]+$/, '') + '.' + ext;
    a.href = resultUrl;
    a.download = name;
    a.click();
  }, [resultUrl, source, targetFormat]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  return (
    <div className={styles.page}>
      <ToolHeader title="图片格式转换" description="将图片转换为 PNG、JPEG 或 WebP 格式" />
      <canvas ref={canvasRef} hidden />
      <div className={styles.workspace}>
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={32} className={styles.uploadIcon} />
          <p>拖拽图片到这里，或点击选择文件</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} hidden />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {preview && (
          <div className={styles.content}>
            <div className={styles.previewCol}>
              <img src={preview} alt="原始" className={styles.preview} />
              <p className={styles.info}>{source?.name} ({source ? (source.size / 1024).toFixed(1) + ' KB' : ''})</p>
            </div>

            <div className={styles.convertControls}>
              <span className={styles.arrow}>→</span>
              <div className={styles.formatBtns}>
                {FORMATS.map((f) => (
                  <button key={f.value} className={targetFormat === f.value ? styles.btn : styles.btnSecondary} onClick={() => handleFormatChange(f.value)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.previewCol}>
              {resultUrl ? (
                <>
                  <img src={resultUrl} alt="转换后" className={styles.preview} />
                  <button className={styles.downloadBtn} onClick={download}>
                    <Download size={14} /> 下载 {FORMATS.find((f) => f.value === targetFormat)?.ext.toUpperCase()}
                  </button>
                </>
              ) : (
                <div className={styles.placeholder}>转换中...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
