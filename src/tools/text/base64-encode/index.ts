import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'base64-encode',
  name: 'Base64 编解码',
  description: '文本与 Base64 互相转换',
  category: ToolCategory.TEXT,
  tags: ['base64', '编码', '解码', 'encode', 'decode'],
  route: '/tools/base64-encode',
  icon: 'code',
  component: lazy(() => import('./Base64Page')),
});
