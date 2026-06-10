import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'number-base',
  name: '进制转换',
  description: '二进制、八进制、十进制、十六进制互转',
  category: ToolCategory.CONVERTER,
  tags: ['进制', '二进制', '十六进制', 'binary', 'hex', '转换'],
  route: '/tools/number-base',
  icon: 'binary',
  component: lazy(() => import('./NumberBasePage')),
});
