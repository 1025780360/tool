import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'html-entity',
  name: 'HTML 实体转换',
  description: 'HTML 实体的编码与解码',
  category: ToolCategory.ENCODING,
  tags: ['html', '实体', 'entity', '转义', '编码'],
  route: '/tools/html-entity',
  icon: 'file-code',
  component: lazy(() => import('./HtmlEntityPage')),
});
