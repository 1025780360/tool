import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'image-convert',
  name: '图片格式转换',
  description: '图片格式互转：PNG、JPEG、WebP',
  category: ToolCategory.IMAGE,
  tags: ['image', '图片', '格式', 'convert', 'png', 'jpg', 'webp'],
  route: '/tools/image-convert',
  icon: 'image',
  component: lazy(() => import('./ConvertFormatPage')),
});
