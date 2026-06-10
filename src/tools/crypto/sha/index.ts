import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'sha',
  name: 'SHA 哈希',
  description: '生成 SHA-1/256/384/512 哈希值',
  category: ToolCategory.CRYPTO,
  tags: ['sha', 'sha256', 'sha512', '哈希', 'hash'],
  route: '/tools/sha',
  icon: 'shield-check',
  component: lazy(() => import('./ShaPage')),
});
