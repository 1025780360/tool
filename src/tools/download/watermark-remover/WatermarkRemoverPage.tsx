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

// 生产环境使用自建 API，开发时设置 VITE_API_URL= 用本地 proxy
const API_BASE = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : 'https://qsy.zeabur.app';

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

async function callAPI(videoUrl: string): Promise<{
  success: boolean; data?: VideoData; message?: string;
}> {
  const apiUrl = API_BASE ? `${API_BASE}/api/parse` : '/api/parse';

  try {
    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: videoUrl }),
    });
    const data = await r.json();
    return parseResponse(data);
  } catch (e) {
    return { success: false, message: `请求失败: ${(e as Error).message}` };
  }
}

function parseResponse(data: Record<string, unknown>): {
  success: boolean; data?: VideoData; message?: string;
} {
  // media-parser API: { succ, retcode, retdesc, data: { platform, title, video_url, cover_url, author } }
  const ok = data.succ === true || data.retcode === 200;
  if (ok && data.data) {
    const d = data.data as Record<string, string>;
    const hasContent = d.video_url || (d.image_list && (d.image_list as unknown[]).length > 0);
    if (!hasContent) {
      return { success: false, message: '该链接解析未获取到视频，请确认链接正确' };
    }
    return {
      success: true,
      data: {
        title: d.title || d.platform + '视频' || '未知标题',
        author: d.author || '未知作者',
        thumbnail: d.cover_url || '',
        downloadUrl: d.video_url || '',
      },
    };
  }
  return { success: false, message: (data.retdesc as string) || '解析失败，请检查链接是否正确' };
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
        description="基于自建 media-parser 后端，支持26个平台去水印下载"
      />

      <div className={styles.workspace}>
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

        {error && (
          <div className={styles.errorBox}>
            <span>{error}</span>
          </div>
        )}

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
              点击下载后在新标签页打开视频，右键或长按即可保存
            </p>
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
