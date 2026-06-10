import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'md5',
  name: 'MD5 哈希',
  description: '生成文本或文件的 MD5 哈希值',
  category: ToolCategory.CRYPTO,
  tags: ['md5', '哈希', 'hash', '加密'],
  route: '/tools/md5',
  icon: 'hash',
  component: lazy(() => import('./Md5Page')),
});
