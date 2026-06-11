import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { Download, Loader2, ExternalLink, Play, Image } from 'lucide-react';
import styles from './WatermarkRemoverPage.module.css';

const PLATFORMS = [
  { pattern: /douyin\.com/, name: '抖音' },
  { pattern: /kuaishou\.com/, name: '快手' },
  { pattern: /xiaohongshu\.com/, name: '小红书' },
  { pattern: /xhslink\.com/, name: '小红书' },
  { pattern: /bilibili\.com/, name: 'B站' },
  { pattern: /weibo\.com/, name: '微博' },
  { pattern: /pipigx\.com/, name: '皮皮虾' },
  { pattern: /weishi\.com/, name: '微视' },
  { pattern: /huoshan\.com/, name: '火山' },
  { pattern: /izuiyou\.com/, name: '最右' },
];

const API_BASE = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : 'https://qsy.zeabur.app';

interface MediaData {
  title: string;
  author: string;
  thumbnail: string;
  downloadUrl: string;
  images: string[];
}

function isValidUrl(url: string): boolean {
  return PLATFORMS.some((p) => p.pattern.test(url));
}

function detectPlatform(url: string): string {
  return PLATFORMS.find((p) => p.pattern.test(url))?.name ?? '未知平台';
}

async function callAPI(videoUrl: string) {
  const apiUrl = API_BASE ? `${API_BASE}/api/parse` : '/api/parse';
  try {
    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: videoUrl }),
    });
    return parseResponse(await r.json());
  } catch (e) {
    return { success: false, message: `请求失败: ${(e as Error).message}` };
  }
}

function getAuthor(author: unknown): string {
  if (!author) return '未知作者';
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    const a = author as Record<string, string>;
    return a.nickname || a.name || a.author_name || '未知作者';
  }
  return '未知作者';
}

function parseResponse(data: Record<string, unknown>): {
  success: boolean; data?: MediaData; message?: string; isImage?: boolean;
} {
  const ok = data.succ === true || data.retcode === 200;
  if (ok && data.data) {
    const d = data.data as Record<string, unknown>;
    const videoUrl = (d.video_url as string) || '';
    const imageList = (d.image_list as Array<{ url?: string } | string>) || [];

    if (imageList.length > 0 && !videoUrl) {
      // Image/gallery post
      return {
        success: true,
        isImage: true,
        data: {
          title: (d.title as string) || (d.platform as string) + '图集' || '图集',
          author: getAuthor(d.author),
          thumbnail: (d.cover_url as string) || '',
          downloadUrl: '',
          images: imageList.map((img) =>
            typeof img === 'string' ? img : (img.url || '')
          ).filter(Boolean),
        },
      };
    }

    if (!videoUrl) {
      return { success: false, message: '未解析到视频或图片，请确认链接正确' };
    }

    return {
      success: true,
      data: {
        title: (d.title as string) || (d.platform as string) + '视频' || '未知标题',
        author: getAuthor(d.author),
        thumbnail: (d.cover_url as string) || '',
        downloadUrl: videoUrl,
        images: [],
      },
    };
  }
  return { success: false, message: (data.retdesc as string) || '解析失败，请检查链接是否正确' };
}

export default function WatermarkRemoverPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaData | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailFail, setThumbnailFail] = useState(false);

  const handleParse = useCallback(async () => {
    if (!input.trim() || loading) return;
    setError('');
    setMedia(null);
    setIsImage(false);
    setThumbnailFail(false);
    setLoading(true);

    const result = await callAPI(input.trim());
    if (result.success && result.data) {
      setMedia(result.data);
      setIsImage(result.isImage || false);
    } else {
      setError(result.message || '解析失败');
    }
    setLoading(false);
  }, [input, loading]);

  const handleDownload = useCallback(() => {
    if (!media?.downloadUrl) return;
    const a = document.createElement('a');
    a.href = media.downloadUrl;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.click();
  }, [media]);

  const handleDownloadImage = useCallback((url: string, index: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `image_${index + 1}.jpg`;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.click();
  }, []);

  const handleOpenVideo = useCallback(() => {
    if (!media?.downloadUrl) return;
    window.open(media.downloadUrl, '_blank', 'noreferrer');
  }, [media]);

  const handleClear = useCallback(() => {
    setInput('');
    setError('');
    setMedia(null);
    setIsImage(false);
    setThumbnailFail(false);
  }, []);

  const valid = isValidUrl(input);
  const platform = valid ? detectPlatform(input) : null;

  return (
    <div className={styles.page}>
      <ToolHeader
        title="短视频去水印"
        description="支持抖音、快手、小红书、B站等26个平台，视频和图集均可解析"
      />

      <div className={styles.workspace}>
        <div className={styles.inputSection}>
          <div className={styles.inputRow}>
            <ToolInput
              value={input}
              onChange={setInput}
              placeholder="粘贴视频或图集分享链接，如 https://v.douyin.com/xxxxx"
              label="视频/图集链接"
              rows={3}
            />
          </div>

          {platform && (
            <span className={styles.platformTag}>
              <Play size={14} />
              {platform}
            </span>
          )}

          <div className={styles.btnRow}>
            <button
              className={styles.parseBtn}
              onClick={handleParse}
              disabled={!valid || loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className={styles.spin} />
                  解析中...
                </>
              ) : (
                '开始解析'
              )}
            </button>
            {input && (
              <button className={styles.clearBtn} onClick={handleClear}>
                清除
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <span>{error}</span>
          </div>
        )}

        {media && (
          <div className={styles.resultCard}>
            <div className={styles.videoInfo}>
              {!thumbnailFail && media.thumbnail ? (
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className={styles.thumbnail}
                  onError={() => setThumbnailFail(true)}
                />
              ) : (
                <div className={styles.thumbnailFallback}>
                  {isImage ? <Image size={32} /> : <Play size={32} />}
                  <span>{isImage ? '图集' : '视频'}</span>
                </div>
              )}
              <div className={styles.videoMeta}>
                <h3 className={styles.videoTitle}>{media.title}</h3>
                <p className={styles.videoAuthor}>作者：{media.author}</p>
                {isImage && (
                  <span className={styles.imageBadge}>
                    <Image size={12} />
                    {media.images.length} 张图片
                  </span>
                )}
              </div>
            </div>

            {isImage ? (
              <div className={styles.imageGrid}>
                {media.images.map((url, i) => (
                  <div key={i} className={styles.imageItem}>
                    <img src={url} alt={`图片 ${i + 1}`} className={styles.imagePreview} />
                    <button
                      className={styles.imageDownloadBtn}
                      onClick={() => handleDownloadImage(url, i)}
                    >
                      <Download size={12} />
                      下载
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.actions}>
                <button className={styles.downloadBtn} onClick={handleDownload}>
                  <Download size={16} />
                  下载无水印视频
                </button>
                <button className={styles.openBtn} onClick={handleOpenVideo}>
                  <ExternalLink size={16} />
                  直接打开
                </button>
              </div>
            )}

            {!isImage && (
              <p className={styles.tip}>
                点击下载后在新标签页打开视频，右键或长按即可保存
              </p>
            )}
          </div>
        )}

        <div className={styles.platforms}>
          <h4 className={styles.platformsTitle}>支持的平台</h4>
          <div className={styles.platformList}>
            {PLATFORMS.slice(0, 9).map((p) => (
              <span key={p.name} className={styles.platformChip}>{p.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
