import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'watermark-remover',
  name: '短视频去水印',
  description: '支持抖音、快手、小红书、B站、微博等平台去水印下载',
  category: ToolCategory.DOWNLOAD,
  tags: ['去水印', '抖音', '快手', '小红书', '下载', '视频', 'b站', '微博'],
  route: '/tools/watermark-remover',
  icon: 'download',
  component: lazy(() => import('./WatermarkRemoverPage')),
  featured: true,
});
