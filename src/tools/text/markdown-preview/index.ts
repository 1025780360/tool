import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'markdown-preview',
  name: 'Markdown 预览',
  description: '实时编辑并预览 Markdown 渲染效果',
  category: ToolCategory.TEXT,
  tags: ['markdown', 'md', '预览', 'preview', '编辑'],
  route: '/tools/markdown-preview',
  icon: 'file-text',
  component: lazy(() => import('./MarkdownPreviewPage')),
  featured: true,
});
