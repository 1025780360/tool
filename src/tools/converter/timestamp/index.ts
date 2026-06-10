import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'timestamp',
  name: '时间戳转换',
  description: 'Unix 时间戳与日期格式互转',
  category: ToolCategory.CONVERTER,
  tags: ['timestamp', '时间戳', 'unix', '日期', '时间'],
  route: '/tools/timestamp',
  icon: 'clock',
  component: lazy(() => import('./TimestampPage')),
});
