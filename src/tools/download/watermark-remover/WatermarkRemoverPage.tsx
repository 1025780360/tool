import { useState, useCallback } from 'react';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolInput } from '@/components/tools/ToolInput';
import { Download, Loader2, ExternalLink, Play } from 'lucide-react';
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

const API_BASE = 'https://api.guijianpan.com/waterRemoveDetail/xxmQsyByAk';
const API_KEY = '31f90c09b9ab4d0daa8a6a957f12a021';

interface VideoData {
  title: string;
  author: string;
  thumbnail: string;
  downloadUrl: string;
}

function isValidUrl(url: string): boolean {
  return PLATFORMS.some((p) => p.pattern.test(url));
}

function detectPlatform(url: string): string {
  return PLATFORMS.find((p) => p.pattern.test(url))?.name ?? '未知平台';
}

async function callAPI(videoUrl: string): Promise<{ success: boolean; data?: VideoData; message?: string }> {
  const targetUrl = `${API_BASE}?ak=${encodeURIComponent(API_KEY)}&link=${encodeURIComponent(videoUrl)}`;

  // 方法1: 直接调用
  try {
    const r = await fetch(targetUrl, { headers: { Accept: 'application/json' } });
    if (r.ok) {
      return parseResponse(await r.json());
    }
  } catch { /* CORS blocked, try proxies */ }

  // 方法2: CORS 代理
  const corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
  ];
  for (const proxy of corsProxies) {
    try {
      const r = await fetch(proxy + encodeURIComponent(targetUrl));
      if (r.ok) {
        return parseResponse(await r.json());
      }
    } catch { continue; }
  }

  return { success: false, message: '解析失败，请检查链接是否正确或稍后重试' };
}

function parseResponse(data: Record<string, unknown>): { success: boolean; data?: VideoData; message?: string } {
  const code = data.code as string;
  const content = data.content as Record<string, string> | undefined;
  const respData = data.data as Record<string, string> | undefined;

  if (code === '10000' && content) {
    return {
      success: true,
      data: {
        title: content.title || '未知标题',
        author: content.author || '未知作者',
        thumbnail: content.cover || '',
        downloadUrl: content.url || '',
      },
    };
  }
  if (code && Number(code) === 200 && respData) {
    return {
      success: true,
      data: {
        title: respData.title || '未知标题',
        author: respData.author || '未知作者',
        thumbnail: respData.cover || '',
        downloadUrl: respData.url || respData.videoUrl || '',
      },
    };
  }
  return { success: false, message: (data.msg as string) || (data.message as string) || '解析失败，不支持该链接' };
}

export default function WatermarkRemoverPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [error, setError] = useState('');
  const [thumbnailFail, setThumbnailFail] = useState(false);

  const handleParse = useCallback(async () => {
    if (!input.trim() || loading) return;
    setError('');
    setVideo(null);
    setThumbnailFail(false);
    setLoading(true);

    const result = await callAPI(input.trim());
    if (result.success && result.data) {
      setVideo(result.data);
    } else {
      setError(result.message || '解析失败');
    }
    setLoading(false);
  }, [input, loading]);

  const handleDownload = useCallback(() => {
    if (!video?.downloadUrl) return;
    const a = document.createElement('a');
    a.href = video.downloadUrl;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.click();
  }, [video]);

  const handleOpenVideo = useCallback(() => {
    if (!video?.downloadUrl) return;
    window.open(video.downloadUrl, '_blank', 'noreferrer');
  }, [video]);

  const valid = isValidUrl(input);
  const platform = valid ? detectPlatform(input) : null;

  return (
    <div className={styles.page}>
      <ToolHeader
        title="短视频去水印"
        description="支持抖音、快手、小红书、B站、微博、皮皮虾、微视、火山、最右等平台"
      />

      <div className={styles.workspace}>
        {/* Input Section */}
        <div className={styles.inputSection}>
          <div className={styles.inputRow}>
            <ToolInput
              value={input}
              onChange={setInput}
              placeholder="粘贴视频分享链接，如 https://v.douyin.com/xxxxx"
              label="视频链接"
              rows={3}
            />
          </div>

          {platform && (
            <span className={styles.platformTag}>
              <Play size={14} />
              {platform}
            </span>
          )}

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
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Result */}
        {video && (
          <div className={styles.resultCard}>
            <div className={styles.videoInfo}>
              {!thumbnailFail && video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={styles.thumbnail}
                  onError={() => setThumbnailFail(true)}
                />
              ) : (
                <div className={styles.thumbnailFallback}>
                  <Play size={32} />
                  <span>视频</span>
                </div>
              )}
              <div className={styles.videoMeta}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                <p className={styles.videoAuthor}>作者：{video.author}</p>
              </div>
            </div>

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

            <p className={styles.tip}>
              💡 点击下载后视频将在新标签页打开，长按或右键即可保存
            </p>
          </div>
        )}

        {/* Supported Platforms */}
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
