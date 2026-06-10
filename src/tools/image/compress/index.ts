import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'image-compress',
  name: '图片压缩',
  description: '在线压缩图片，减小文件体积',
  category: ToolCategory.IMAGE,
  tags: ['image', '图片', '压缩', 'compress', '减小体积'],
  route: '/tools/image-compress',
  icon: 'image-down',
  component: lazy(() => import('./CompressPage')),
  usesWorker: true,
});
