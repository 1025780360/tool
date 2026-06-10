import { useState, useCallback, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Upload, Download } from 'lucide-react';
import styles from './CompressPage.module.css';

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function CompressPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalPreview, setOriginalPreview] = useState('');
  const [compressedPreview, setCompressedPreview] = useState('');
  const [quality, setQuality] = useState(0.8);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setOriginalFile(file);
    setCompressedBlob(null);
    setCompressedPreview('');
    setError('');

    // Preview original
    const reader = new FileReader();
    reader.onload = (e) => setOriginalPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality,
      };
      const compressed = await imageCompression(file, options);
      setCompressedBlob(compressed);

      const compressedReader = new FileReader();
      compressedReader.onload = (e) => setCompressedPreview(e.target?.result as string);
      compressedReader.readAsDataURL(compressed);
    } catch {
      setError('压缩失败，请尝试其他图片');
    }
    setLoading(false);
  }, [quality, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, [handleFile]);

  const download = useCallback(() => {
    if (!compressedBlob || !originalFile) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    const name = originalFile.name.replace(/(\.[^.]+)$/, '_compressed$1');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, [compressedBlob, originalFile]);

  return (
    <div className={styles.page}>
      <ToolHeader title="图片压缩" description="压缩图片体积，支持 JPG/PNG/WebP 格式" />
      <div className={styles.workspace}>
        <div className={styles.controls}>
          <label className={styles.option}>
            质量: <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className={styles.range} />
            <span>{Math.round(quality * 100)}%</span>
          </label>
          <label className={styles.option}>
            最大: <select value={maxSizeMB} onChange={(e) => setMaxSizeMB(Number(e.target.value))} className={styles.select}>
              <option value={0.5}>0.5 MB</option>
              <option value={1}>1 MB</option>
              <option value={2}>2 MB</option>
              <option value={5}>5 MB</option>
            </select>
          </label>
        </div>

        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={32} className={styles.uploadIcon} />
          <p>拖拽图片到这里，或点击选择文件</p>
          <p className={styles.hint}>支持 JPG、PNG、WebP</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} hidden />
        </div>

        {loading && <div className={styles.loading}>压缩中...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {(originalPreview || compressedPreview) && (
          <div className={styles.compare}>
            <div className={styles.previewCol}>
              <img src={originalPreview} alt="原始图片" className={styles.preview} />
              <p className={styles.info}>
                原始: {originalFile ? formatSize(originalFile.size) : '-'}
              </p>
            </div>
            <div className={styles.previewCol}>
              {compressedPreview ? (
                <>
                  <img src={compressedPreview} alt="压缩后" className={styles.preview} />
                  <p className={styles.info}>
                    压缩后: {compressedBlob ? formatSize(compressedBlob.size) : '-'}
                    {originalFile && compressedBlob && (
                      <span className={styles.ratio}>
                        {' '}(节省 {Math.round((1 - compressedBlob.size / originalFile.size) * 100)}%)
                      </span>
                    )}
                  </p>
                  <button className={styles.downloadBtn} onClick={download}>
                    <Download size={14} /> 下载
                  </button>
                </>
              ) : (
                <div className={styles.placeholder}>处理中...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
