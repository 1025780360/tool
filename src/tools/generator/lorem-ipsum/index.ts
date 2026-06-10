import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'lorem-ipsum',
  name: 'Lorem Ipsum 生成器',
  description: '生成占位文本，用于设计排版',
  category: ToolCategory.GENERATOR,
  tags: ['lorem', 'ipsum', '占位', '文本', '假文'],
  route: '/tools/lorem-ipsum',
  icon: 'type',
  component: lazy(() => import('./LoremIpsumPage')),
});
