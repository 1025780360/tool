import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'json-formatter',
  name: 'JSON 格式化',
  description: '格式化、压缩、验证 JSON 数据',
  category: ToolCategory.TEXT,
  tags: ['json', '格式化', '美化', '压缩', '验证'],
  route: '/tools/json-formatter',
  icon: 'braces',
  component: lazy(() => import('./JsonFormatterPage')),
  featured: true,
});
