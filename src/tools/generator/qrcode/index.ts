import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'qrcode',
  name: '二维码生成',
  description: '将文本或 URL 生成二维码图片',
  category: ToolCategory.GENERATOR,
  tags: ['qrcode', '二维码', 'qr', '生成'],
  route: '/tools/qrcode',
  icon: 'qr-code',
  component: lazy(() => import('./QrcodePage')),
  featured: true,
});
