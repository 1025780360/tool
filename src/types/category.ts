export enum ToolCategory {
  TEXT = 'text',
  ENCODING = 'encoding',
  CRYPTO = 'crypto',
  IMAGE = 'image',
  CONVERTER = 'converter',
  GENERATOR = 'generator',
  DOWNLOAD = 'download',
}

export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORIES: Record<ToolCategory, CategoryMeta> = {
  [ToolCategory.TEXT]: {
    id: ToolCategory.TEXT,
    label: '文本处理',
    icon: 'file-text',
    description: 'JSON 格式化、Base64 编解码、Markdown 预览',
    color: '#3b82f6',
  },
  [ToolCategory.ENCODING]: {
    id: ToolCategory.ENCODING,
    label: '编码转换',
    icon: 'binary',
    description: 'URL 编解码、HTML 实体、JWT 调试',
    color: '#8b5cf6',
  },
  [ToolCategory.CRYPTO]: {
    id: ToolCategory.CRYPTO,
    label: '加密哈希',
    icon: 'shield',
    description: 'MD5、SHA 系列、UUID 生成',
    color: '#ef4444',
  },
  [ToolCategory.IMAGE]: {
    id: ToolCategory.IMAGE,
    label: '图片处理',
    icon: 'image',
    description: '图片压缩、格式转换、颜色选择器',
    color: '#f59e0b',
  },
  [ToolCategory.CONVERTER]: {
    id: ToolCategory.CONVERTER,
    label: '单位换算',
    icon: 'repeat',
    description: '时间戳转换、进制转换、单位换算',
    color: '#10b981',
  },
  [ToolCategory.GENERATOR]: {
    id: ToolCategory.GENERATOR,
    label: '生成器',
    icon: 'wand-2',
    description: '密码生成、Lorem Ipsum、二维码',
    color: '#ec4899',
  },
  [ToolCategory.DOWNLOAD]: {
    id: ToolCategory.DOWNLOAD,
    label: '视频下载',
    icon: 'download',
    description: '短视频去水印下载',
    color: '#f97316',
  },
};
